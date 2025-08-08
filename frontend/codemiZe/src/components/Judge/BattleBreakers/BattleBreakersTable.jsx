import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { imagePath } from '../../../utils/helper.js';

const BattleBreakersTable = ({
  questions,
  schools,
  answerHistory,
  currentQuestionIndex,
  showQuestionText,
  setShowQuestionText,
  goToNextQuestion,
  goToPrevQuestion,
  isJudgeView = false,
}) => {

  // Helper: get status for a school in a question from answer history
  const getCellStatus = (questionId, schoolId) => {
    const questionAnswers = answerHistory[questionId];
    if (!questionAnswers) return null;
    
    // Check if this school answered correctly
    if (questionAnswers[schoolId] === true) {
      return 'correct';
    } else if (questionAnswers[schoolId] === false) {
      return 'wrong';
    }
    
    return null;
  };

  // Helper: get which school is correct in a question
  const getCorrectSchool = (questionId) => {
    const questionAnswers = answerHistory[questionId];
    if (!questionAnswers) return null;
    return questionAnswers.correctSchool || null;
  };

  // Helper: calculate marks based on attempts (following the same logic as admin)
  const getMarksForSchool = (questionId, schoolId) => {
    const questionAnswers = answerHistory[questionId];
    if (!questionAnswers) return 0;
    
    if (questionAnswers[schoolId] === true) {
      // Correct answer - check attempt number to determine marks
      const totalAttempts = questionAnswers.totalAttempts || 0;
      if (totalAttempts <= 1) return 10; // First attempt
      else if (totalAttempts === 2) return 5; // Second attempt  
      else return 0; // Third attempt or more
    } else if (questionAnswers[schoolId] === false) {
      // Wrong answer - check if it's first wrong attempt (-5) or subsequent (0)
      // This is simplified - in practice you'd need more detailed attempt tracking
      return -5;
    }
    
    return 0;
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[1020px] h-[500px] bg-white rounded-[5px] border border-black/90 mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4 px-6 pt-6">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowQuestionText(!showQuestionText)}
              className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            >
              {showQuestionText ? 'Hide Question Text' : 'Show Question Text'}
            </button>
          </div>

        </div>
        <div className="overflow-x-auto flex-1 px-6 pb-4">
          <table className="w-max bg-white" style={{ minWidth: '970px' }}>
            <thead>
              <tr className="bg-gray-100 border-b border-black/20">
                <th className="py-2 px-4 text-left text-sm font-medium text-purple-800 w-40 sticky left-0 bg-gray-100 z-10">
                  {showQuestionText ? '#  Question' : '#'}
                </th>
                {schools.map((school) => (
                  <th key={school._id} className="py-2 px-3 text-center text-sm font-medium text-purple-800 border-l border-black/20 min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                        <img
                          src={imagePath(school.avatar?.url)}
                          alt={school.nameInShort}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium">{school.nameInShort}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((question, qIndex) => {
                const correctSchool = getCorrectSchool(question._id);
                return (
                  <tr
                    key={question._id}
                    className={qIndex % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-2 px-4 text-sm font-medium sticky left-0 bg-white border-r border-black/20 z-10 max-w-[220px]">
                      {showQuestionText ? (
                        <div className="truncate">
                          <span className="font-bold mr-2">{qIndex + 1}.</span>
                          {question.question}
                        </div>
                      ) : (
                        <div className="truncate text-xs font-bold">Q{qIndex + 1}</div>
                      )}
                    </td>
                    {schools.map((school) => {
                      const cellStatus = getCellStatus(question._id, school._id);
                      const marks = getMarksForSchool(question._id, school._id);
                      
                      return (
                        <td key={`${question._id}-${school._id}`} className="py-2 px-3 text-center border-l border-black/20 min-w-[120px]">
                          {cellStatus === 'correct' ? (
                            <span className="text-green-500 font-bold">
                              ✓ {marks > 0 ? `(${marks})` : ''}
                            </span>
                          ) : cellStatus === 'wrong' ? (
                            <span className="text-red-500 font-bold">
                              ✗ {marks < 0 ? `(${marks})` : ''}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Total row */}
              <tr className="bg-purple-50">
                <td className="py-3 px-4 text-sm font-bold text-purple-800 sticky left-0 bg-purple-50 border-r border-black/20 z-10">
                  Total
                </td>
                {schools.map((school) => {
                  // Calculate total for this school
                  let total = 0;
                  questions.forEach(q => {
                    total += getMarksForSchool(q._id, school._id);
                  });
                  return (
                    <td key={`total-${school._id}`} className="py-2 px-3 text-center font-bold text-purple-800 border-l border-black/20">
                      {total}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BattleBreakersTable;