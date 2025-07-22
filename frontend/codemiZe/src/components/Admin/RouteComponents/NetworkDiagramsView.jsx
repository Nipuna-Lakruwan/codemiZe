import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';

const NetworkDiagramsView = ({ teams }) => {
  const [activeJudge, setActiveJudge] = useState('Overall Score');

  // List of judges - can be updated as needed
  const judges = ['Overall Score', 'Judge 1', 'Judge 2', 'Judge 3'];

  // Criteria for network diagrams
  const criteria = [
    'Network Design', 'Router Configuration', 'Network Security', 'IP Addressing',
    'Protocol Implementation', 'Documentation', 'Total'
  ];

  // Sample marking data - would be replaced with real data from backend
  const markings = {
    'Overall Score': {},
    'Judge 1': {},
    'Judge 2': {},
    'Judge 3': {}
  };

  // Generate random scores for demo purposes
  teams.forEach(team => {
    const teamName = team.name;
    judges.forEach(judge => {
      // Generate 6 random scores between 6 and 10, plus a total
      const scores = Array(6).fill().map(() => Math.floor(Math.random() * 5) + 6);
      const total = scores.reduce((sum, score) => sum + score, 0);
      markings[judge][teamName] = [...scores, total];
    });
  });

  const handleJudgeChange = (judgeName) => {
    setActiveJudge(judgeName);
  };

  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    console.log('Downloading PDF of Network Diagrams marking sheet');
    // Alert could be shown through parent component if needed
  };

  // Judges list already declared above

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        {/* Tab Rectangle */}
        <div className="w-[604px] h-10 bg-white rounded-[3px] border border-black/20 flex items-center">
          {judges.map(judge => (
            <div
              key={judge}
              className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeJudge === judge ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
              onClick={() => handleJudgeChange(judge)}
            >
              <span className="text-xs font-medium">{judge}</span>
            </div>
          ))}
        </div>

        {/* Download PDF button */}
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

      {/* Marking Table */}
      <div className="overflow-x-auto">
        <div className="p-1 border-4 border-black rounded-xl">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b border-r text-left text-sm font-medium text-purple-800">Criteria</th>
                {teams.map((team) => (
                  <th key={team.id} className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">
                    {team.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion, index) => (
                <tr key={criterion} className={index === criteria.length - 1 ? "bg-purple-50" : ""}>
                  <td className={`py-2 px-4 border-b border-r text-left text-sm font-medium ${index === criteria.length - 1 ? "text-purple-800" : "text-gray-700"}`}>
                    {criterion}
                  </td>
                  {teams.map((team) => (
                    <td key={`${team.id}-${criterion}`} className={`py-2 px-4 border-b border-r text-center text-sm ${index === criteria.length - 1 ? "font-bold text-purple-800" : "text-gray-700"}`}>
                      {markings[activeJudge][team.name]?.[index] || '-'}
                    </td>
                  ))}
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
