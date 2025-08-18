import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper: safe access mark by criteria index
const getMarkByIndex = (judgeData, teamKey, idx) => {
  if (!judgeData) return '-';
  const teamMarks = judgeData[teamKey];
  if (!teamMarks) return '-';
  return teamMarks[idx] ?? '-';
};

const NetworkDiagramsView = ({ teams }) => {
  const [criteria, setCriteria] = useState([]); // criteria names (without Total)
  const [judgeMap, setJudgeMap] = useState({}); // judgeId -> judgeName
  const [activeJudge, setActiveJudge] = useState('Overall');
  const [markingsRaw, setMarkingsRaw] = useState([]); // raw docs from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  // Fetch criteria (route seekers) & judges & markings
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true); setError(null);
      try {
        // Parallel fetch
        const [criteriaRes, judgesRes, markingsRes] = await Promise.all([
          axiosInstance.get('/api/v1/criteria/routeSeekers'), // criteria for route seekers
          axiosInstance.get(API_PATHS.ADMIN.GET_ALL_JUDGES),
          axiosInstance.get(API_PATHS.JUDGE.GET_ROUTE_SEEKERS_NETWORK_DESIGN_MARKINGS)
        ]);

        // Criteria response returns single criterion or array? Using controller getCriteriaByGameType -> returns {success, data: [...]}
        const critData = criteriaRes.data?.data || [];
        setCriteria(critData.map(c => c.criteria));

        const judgeArr = judgesRes.data?.judges || [];
        const jMap = {};
        judgeArr.forEach(j => { jMap[j._id] = j.name || j.email || 'Judge'; });
        setJudgeMap(jMap);

        setMarkingsRaw(markingsRes.data || []);

        // Determine active judge default
        if (Object.keys(jMap).length > 0) {
          setActiveJudge('Overall');
        }
      } catch (e) {
        console.error('Failed to fetch network design data', e);
        setError('Failed to load network design markings');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Transform markings into judge -> team(shortName) -> marks[] plus total appended
  const transformedMarkings = useMemo(() => {
    if (!criteria.length) return {};
    const judgeBuckets = {};
    // Build school id -> short name map
    const schoolIdToShort = {};
    teams.forEach(t => { if (t._id || t.id) schoolIdToShort[t._id || t.id] = t.nameInShort || t.name; });

    markingsRaw.forEach(doc => {
      const jId = doc.judgeId;
      const schoolKey = schoolIdToShort[doc.schoolId] || doc.schoolId; // fallback id
      if (!judgeBuckets[jId]) judgeBuckets[jId] = {};
      // Ensure marks order matches criteria order; doc.marks contains {criteriaId, mark}
      // Backend does not give criteriaId -> criteria text mapping here, assume order mapping occurs when judges enter; we'll map by index
      const marksArray = criteria.map((_, idx) => doc.marks[idx]?.mark ?? 0);
      const total = marksArray.reduce((a, b) => a + (Number(b) || 0), 0);
      judgeBuckets[jId][schoolKey] = [...marksArray, total];
    });
    return judgeBuckets; // {judgeId: { TEAM: [m1,m2,...,total] }}
  }, [markingsRaw, criteria, teams]);

  const judgeTabs = useMemo(() => ['Overall', ...Object.keys(judgeMap).map(id => judgeMap[id])], [judgeMap]);

  // Build mapping from judge display name back to judge id
  const displayNameToJudgeId = useMemo(() => {
    const map = {};
    Object.entries(judgeMap).forEach(([id, name]) => { map[name] = id; });
    return map;
  }, [judgeMap]);

  // Compute overall aggregated marks: average across judges for each criteria, per team
  const overallData = useMemo(() => {
    if (!criteria.length) return {};
    const result = {};
    const judgeIds = Object.keys(transformedMarkings);
    if (!judgeIds.length) return result;
    // Gather team list from teams prop (use short names or name)
    const teamKeys = teams.map(t => t.nameInShort || t.name);
    teamKeys.forEach(teamKey => {
      // Accumulate per criteria
      const sums = new Array(criteria.length).fill(0);
      let contributing = 0;
      judgeIds.forEach(jid => {
        const judgeTeamMarks = transformedMarkings[jid][teamKey];
        if (judgeTeamMarks) {
          contributing++;
          judgeTeamMarks.slice(0, criteria.length).forEach((m, idx) => {
            sums[idx] += Number(m) || 0;
          });
        }
      });
      if (contributing > 0) {
        const averages = sums.map(s => Math.round(s / contributing));
        const total = averages.reduce((a, b) => a + b, 0);
        result[teamKey] = [...averages, total];
      }
    });
    return result; // same shape
  }, [criteria.length, transformedMarkings, teams]);

  const activeJudgeData = useMemo(() => {
    if (activeJudge === 'Overall') return overallData;
    const judgeId = displayNameToJudgeId[activeJudge];
    return transformedMarkings[judgeId] || {};
  }, [activeJudge, overallData, transformedMarkings, displayNameToJudgeId]);

  const handleJudgeChange = (judgeName) => setActiveJudge(judgeName);

  const handleDownloadPDF = async () => {
    try {
      if (!criteria.length) return;
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const temp = document.createElement('div');
      temp.style.position = 'fixed';
      temp.style.left = '-9999px';
      temp.style.top = '0';
      temp.style.background = '#fff';
      temp.style.padding = '32px';
      temp.style.width = '1200px';

      const teamKeys = teams.map(t => t.nameInShort || t.name);

      temp.innerHTML = `
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#7c3aed;font-size:24px;margin:0 0 8px;font-weight:700;">Route Seekers - Network Design Marking Sheet</h1>
          <p style="margin:4px 0;color:#555;font-size:12px;">Judge: ${activeJudge}</p>
          <p style="margin:4px 0;color:#555;font-size:12px;">Generated on: ${currentDate} at ${currentTime}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:8px;border:1px solid #000;text-align:left;color:#7c3aed;font-weight:700;">Criteria</th>
              ${teamKeys.map(t => `<th style=\"padding:8px;border:1px solid #000;text-align:center;color:#7c3aed;font-weight:700;\">${t}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${[...criteria, 'Total'].map((crit, rowIdx) => `
              <tr style="${rowIdx === criteria.length ? 'background:#faf5ff;' : ''}">
                <td style="padding:6px;border:1px solid #000;text-align:left;font-weight:${rowIdx===criteria.length?'700':'500'};color:${rowIdx===criteria.length?'#7c3aed':'#374151'};">${crit}</td>
                ${teamKeys.map(team => {
                  const row = activeJudgeData[team];
                  const val = row ? row[rowIdx] ?? '-' : '-';
                  return `<td style=\"padding:6px;border:1px solid #000;text-align:center;font-weight:${rowIdx===criteria.length?'700':'400'};color:${rowIdx===criteria.length?'#7c3aed':'#374151'};\">${val}</td>`;
                }).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #ddd;text-align:center;font-size:10px;color:#666;">CodemiZe Auto-generated Document</div>
      `;
      document.body.appendChild(temp);
      const canvas = await html2canvas(temp, { scale: 2 });
      document.body.removeChild(temp);
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pw / canvas.width, ph / canvas.height);
      pdf.addImage(img, 'PNG', (pw - canvas.width * ratio) / 2, 8, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`RouteSeekers_NetworkDesign_${activeJudge}_${currentDate.replace(/\//g,'-')}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500 px-4 py-2">Loading network design markings...</div>;
  }
  if (error) {
    return <div className="text-sm text-red-600 px-4 py-2">{error}</div>;
  }

  return (
    <div className="w-full" ref={tableRef}>
      <div className="flex justify-between items-center mb-6">
        {/* Judge Tabs */}
        <div className="bg-white rounded-[3px] border border-black/20 flex items-center" style={{ minWidth: (judgeTabs.length * 140) + 'px' }}>
          {judgeTabs.map(j => (
            <div
              key={j}
              className={`px-4 h-10 flex-1 flex items-center justify-center cursor-pointer transition-colors text-center ${activeJudge === j ? 'bg-sky-600 text-white' : 'text-gray-700 hover:bg-sky-50'}`}
              onClick={() => handleJudgeChange(j)}
            >
              <span className="text-xs font-semibold truncate">{j}</span>
            </div>
          ))}
        </div>
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
                <th className="py-3 px-4 border-b border-r text-left text-sm font-medium text-purple-800">Criteria</th>
                {teams.map(team => (
                  <th key={team._id || team.id || team.name} className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">
                    {team.nameInShort || team.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...criteria, 'Total'].map((crit, idx) => (
                <tr key={crit} className={idx === criteria.length ? 'bg-purple-50' : ''}>
                  <td className={`py-2 px-4 border-b border-r text-left text-sm font-medium ${idx === criteria.length ? 'text-purple-800' : 'text-gray-700'}`}>{crit}</td>
                  {teams.map(team => {
                    const teamKey = team.nameInShort || team.name;
                    const row = activeJudgeData[teamKey];
                    const val = row ? row[idx] ?? '-' : '-';
                    return (
                      <td key={teamKey + '-' + crit} className={`py-2 px-4 border-b border-r text-center text-sm ${idx === criteria.length ? 'font-bold text-purple-800' : 'text-gray-700'}`}>{val}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagramsView;
