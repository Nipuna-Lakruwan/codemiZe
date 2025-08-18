import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';

const NetworkDiagramsView = ({ teams, judges: rawJudges, criteria: rawCriteria, networkMarkings }) => {
  const [activeJudge, setActiveJudge] = useState('Overall Score');

  const { judges, criteria, processedMarkings } = useMemo(() => {
    if (!rawJudges || !rawCriteria || !networkMarkings || !teams) {
      return { judges: [], criteria: [], processedMarkings: {} };
    }

    const criteriaWithTotal = [...rawCriteria, { _id: 'total', criteria: 'Total' }];
    const judgesWithOverall = [{ _id: 'Overall Score', name: 'Overall Score' }, ...rawJudges];

    const markingsData = {};

    // Initialize structure for each judge
    judgesWithOverall.forEach(judge => {
      markingsData[judge._id] = {};
      teams.forEach(team => {
        markingsData[judge._id][team._id] = {};
        criteriaWithTotal.forEach(c => {
          markingsData[judge._id][team._id][c._id] = 0;
        });
      });
    });

    // Populate with actual marks from judges
    networkMarkings.forEach(marking => {
      const judgeId = marking.judgeId;
      const schoolId = marking.schoolId;

      if (markingsData[judgeId] && markingsData[judgeId][schoolId]) {
        let total = 0;
        marking.marks.forEach(m => {
          markingsData[judgeId][schoolId][m.criteriaId] = m.mark;
          total += m.mark;
        });
        markingsData[judgeId][schoolId]['total'] = total;
      }
    });

    // Calculate Overall Score
    teams.forEach(team => {
      let overallTotalForTeam = 0;
      rawCriteria.forEach(criterion => {
        const marksForCriterion = rawJudges
          .map(judge => markingsData[judge._id]?.[team._id]?.[criterion._id])
          .filter(mark => typeof mark === 'number');
        
        const avgMark = marksForCriterion.length > 0
          ? Math.round(marksForCriterion.reduce((a, b) => a + b, 0) / marksForCriterion.length)
          : 0;
        
        markingsData['Overall Score'][team._id][criterion._id] = avgMark;
        overallTotalForTeam += avgMark;
      });
      markingsData['Overall Score'][team._id]['total'] = overallTotalForTeam;
    });

    return {
      judges: judgesWithOverall,
      criteria: criteriaWithTotal,
      processedMarkings: markingsData,
    };
  }, [teams, rawJudges, rawCriteria, networkMarkings]);

  const handleJudgeChange = (judgeId) => {
    setActiveJudge(judgeId);
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF of Network Diagrams marking sheet');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="w-auto max-w-[800px] h-10 bg-white rounded-[3px] border border-black/20 flex items-center">
          {judges.map(judge => (
            <div
              key={judge._id}
              className={`flex-1 h-full flex items-center justify-center cursor-pointer px-4 ${activeJudge === judge._id ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
              onClick={() => handleJudgeChange(judge._id)}
            >
              <span className="text-xs font-medium whitespace-nowrap">{judge.name}</span>
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
                {teams.map((team) => (
                  <th key={team._id} className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">
                    {team.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion, index) => (
                <tr key={criterion._id} className={index === criteria.length - 1 ? "bg-purple-50" : ""}>
                  <td className={`py-2 px-4 border-b border-r text-left text-sm font-medium ${index === criteria.length - 1 ? "text-purple-800" : "text-gray-700"}`}>
                    {criterion.criteria}
                  </td>
                  {teams.map((team) => (
                    <td key={`${team._id}-${criterion._id}`} className={`py-2 px-4 border-b border-r text-center text-sm ${index === criteria.length - 1 ? "font-bold text-purple-800" : "text-gray-700"}`}>
                      {processedMarkings[activeJudge]?.[team._id]?.[criterion._id] ?? '-'}
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