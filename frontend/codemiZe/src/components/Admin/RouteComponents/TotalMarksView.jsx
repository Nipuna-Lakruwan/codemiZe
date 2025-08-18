import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/*
  TotalMarksView responsibilities:
  - Fetch quiz (questionnaire) scores (RouteSeekersAnswer.score)
  - Fetch network design markings from all judges
  - Compute average network design total per school
  - Compute Total Score = quizScore + (averageDesignTotal / 2)
  - Provide PDF download (single averaged view; no judge tabs)
*/

const TotalMarksView = ({ teams }) => {
  const [answers, setAnswers] = useState([]); // RouteSeekersAnswer docs
  const [designMarkings, setDesignMarkings] = useState([]); // network design marking docs
  // No judge tabs needed; we always show averaged results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true); setError(null);
      try {
        const [answersRes, markingsRes] = await Promise.all([
          axiosInstance.get('/api/v1/route-seekers/all-student-answers'),
          axiosInstance.get('/api/v1/judge/route-seekers-network-design/')
        ]);
        setAnswers(answersRes.data || []);
        setDesignMarkings(markingsRes.data || []);
      } catch (e) {
        console.error('Failed to fetch total marks data', e);
        setError('Failed to load total marks');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build quick lookup for quiz scores: userId (schoolId) -> score
  const quizScoreMap = useMemo(() => {
    const map = {};
    answers.forEach(a => { map[a.userId] = a.score || 0; });
    return map;
  }, [answers]);

  // Average design total per school across all judges
  const averageDesignTotals = useMemo(() => {
    const sums = {}; const counts = {};
    designMarkings.forEach(doc => {
      const s = doc.schoolId;
      const total = (doc.marks || []).reduce((sum, m) => sum + (m.mark || 0), 0);
      sums[s] = (sums[s] || 0) + total;
      counts[s] = (counts[s] || 0) + 1;
    });
    const avg = {};
    Object.keys(sums).forEach(s => { avg[s] = sums[s] / counts[s]; });
    return avg;
  }, [designMarkings]);

  // Build rows for current tab
  const rows = useMemo(() => teams.map(team => {
    const schoolId = team._id || team.id;
    const quizScore = quizScoreMap[schoolId] || 0;
    const designTotal = averageDesignTotals[schoolId] || 0;
    const totalScore = quizScore + (designTotal / 2);
    return {
      schoolId,
      name: team.name,
      nameInShort: team.nameInShort,
      city: team.city,
      logo: team.logo,
      quizScore: Math.round(quizScore),
      designTotal: Math.round(designTotal),
      totalScore: Math.round(totalScore)
    };
  }), [teams, quizScoreMap, averageDesignTotals]);

  const sortedRows = useMemo(() => [...rows].sort((a,b)=>b.totalScore - a.totalScore), [rows]);

  const handleDownloadPDF = async () => {
    try {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const temp = document.createElement('div');
      temp.style.position = 'fixed'; temp.style.left='-9999px'; temp.style.top='0';
      temp.style.background='#fff'; temp.style.padding='32px'; temp.style.width='1000px';
      temp.innerHTML = `
        <div style="text-align:center;margin-bottom:20px;">
          <h1 style="color:#7c3aed;font-size:22px;margin:0 0 6px;font-weight:700;">Route Seekers - Total Marks (Averaged)</h1>
          <p style="margin:4px 0;color:#555;font-size:12px;">Generated on: ${currentDate} at ${currentTime}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:8px;border:1px solid #000;text-align:left;color:#7c3aed;font-weight:700;">School</th>
              <th style="padding:8px;border:1px solid #000;text-align:center;color:#7c3aed;font-weight:700;">Questionnaire</th>
              <th style="padding:8px;border:1px solid #000;text-align:center;color:#7c3aed;font-weight:700;">Network Design (Avg)</th>
              <th style="padding:8px;border:1px solid #000;text-align:center;color:#7c3aed;font-weight:700;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sortedRows.map((r,i)=>`<tr style="${i<3?'background:#faf5ff;':''}">
              <td style="padding:6px;border:1px solid #000;text-align:left;font-weight:${i<3?'600':'400'};">${r.nameInShort || r.name}</td>
              <td style="padding:6px;border:1px solid #000;text-align:center;">${r.quizScore}</td>
              <td style="padding:6px;border:1px solid #000;text-align:center;">${r.designTotal}</td>
              <td style="padding:6px;border:1px solid #000;text-align:center;font-weight:700;color:#7c3aed;">${r.totalScore}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:18px;text-align:center;font-size:10px;color:#666;">CodemiZe Auto-generated Document</div>
      `;
      document.body.appendChild(temp);
      const canvas = await html2canvas(temp,{scale:2});
      document.body.removeChild(temp);
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l','mm','a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pw/canvas.width, ph/canvas.height);
      pdf.addImage(img,'PNG',(pw-canvas.width*ratio)/2,8,canvas.width*ratio,canvas.height*ratio);
  pdf.save(`RouteSeekers_TotalMarks_Average_${currentDate.replace(/\//g,'-')}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    }
  };

  if (loading) return <div className="text-sm text-gray-500 px-4 py-2">Loading total marks...</div>;
  if (error) return <div className="text-sm text-red-600 px-4 py-2">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-purple-800 font-semibold text-lg ml-2">Total Marks</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 h-10 bg-purple-800 rounded-[3px] text-white px-4 text-sm font-medium"
        >
          <FaFilePdf size={14} />
          Download PDF
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <div className="p-1 border-4 border-black rounded-xl">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b border-r text-left text-sm font-medium text-purple-800">School</th>
                <th className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">Questionnaire</th>
                <th className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">Network Design (Avg)</th>
                <th className="py-3 px-4 border-b text-center text-sm font-medium text-purple-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, index) => (
                <tr key={row.schoolId} className={index < 3 ? 'bg-purple-50' : ''}>
                  <td className="py-3 px-4 border-b border-r text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-neutral-500 flex items-center justify-center mr-3">
                        <img src={row.logo || '/c-logo.png'} alt={row.name} className="max-w-full max-h-full object-cover" />
                      </div>
                      <span className={index < 3 ? 'font-medium' : ''}>{row.nameInShort || row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-r text-center text-sm">{row.quizScore}</td>
                  <td className="py-3 px-4 border-b border-r text-center text-sm">{row.designTotal}</td>
                  <td className={`py-3 px-4 border-b text-center text-sm font-bold ${index < 3 ? 'text-purple-800' : 'text-gray-700'}`}>{row.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TotalMarksView;
