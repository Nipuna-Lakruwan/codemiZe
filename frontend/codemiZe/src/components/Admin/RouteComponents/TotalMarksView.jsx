import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';

const TotalMarksView = ({ teams }) => {
  const [activeJudge, setActiveJudge] = useState('Overall Score');

  // List of judges - can be updated as needed
  const judges = ['Overall Score', 'Judge 1', 'Judge 2', 'Judge 3'];

  // Generate random scores for each team for demonstration purposes
  const teamScores = teams.map(team => {
    const questionnaireScore = Math.floor(Math.random() * 30) + 60; // Random score between 60-89
    const networkDesignScore = Math.floor(Math.random() * 30) + 60; // Random score between 60-89
    const totalScore = questionnaireScore + networkDesignScore;

    return {
      ...team,
      questionnaireScore,
      networkDesignScore,
      totalScore
    };
  });

  // Sort teams by total score (descending)
  const sortedTeams = [...teamScores].sort((a, b) => b.totalScore - a.totalScore);

  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    console.log('Downloading PDF of Total Marks');
    // Alert could be shown through parent component if needed
  };

  const handleJudgeChange = (judgeName) => {
    setActiveJudge(judgeName);
  };

  // No need for tab width and positions with the new tab design

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

      {/* Total Marks Table */}
      <div className="overflow-x-auto">
        <div className="p-1 border-4 border-black rounded-xl">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b border-r text-left text-sm font-medium text-purple-800">School</th>
                <th className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">Questionnaire Marks</th>
                <th className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">Network Design Marks</th>
                <th className="py-3 px-4 border-b text-center text-sm font-medium text-purple-800">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className={index < 3 ? "bg-purple-50" : ""}>
                  <td className="py-3 px-4 border-b border-r text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-neutral-500 flex items-center justify-center mr-3">
                        <img src={team.logo || "/c-logo.png"} alt={team.name} className="max-w-full max-h-full object-cover" />
                      </div>
                      <span className={index < 3 ? "font-medium" : ""}>{team.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-r text-center text-sm">
                    {team.questionnaireScore}
                  </td>
                  <td className="py-3 px-4 border-b border-r text-center text-sm">
                    {team.networkDesignScore}
                  </td>
                  <td className={`py-3 px-4 border-b text-center text-sm font-bold ${index === 0 ? 'text-purple-800' :
                    index === 1 ? 'text-purple-800' :
                      index === 2 ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                    {team.totalScore}
                  </td>
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
