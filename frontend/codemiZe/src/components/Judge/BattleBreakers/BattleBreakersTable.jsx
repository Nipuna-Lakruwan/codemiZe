import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const CustomAlert = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center min-w-[320px]">
        <div className="text-purple-900 text-lg font-bold mb-2">Marks Submitted</div>
        <div className="text-gray-700 text-sm mb-4 whitespace-pre-wrap text-center">{message}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-sky-600 text-white rounded-md text-base font-semibold"
          onClick={onClose}
        >
          OK
        </motion.button>
      </div>
    </div>
  );
};

const BattleBreakersTable = ({
  questions,
  schools,
  answerHistory,
  currentQuestionIndex,
  schoolAnswers,
  correctSchool,
  totalAttempts,
  wrongAttempts,
  isQuestionActive,
  showQuestionText,
  setShowQuestionText,
  handleMarkAnswer,
  goToNextQuestion,
  goToPrevQuestion,
  setIsQuestionActive,
}) => {
  // Track which row is selected for marking
  const [selectedRow, setSelectedRow] = useState(null);
  // Store marking results: { [questionId]: { [schoolId]: { status: 'correct'|'wrong', attempt: 1|2, marks: number } } }
  const [markings, setMarkings] = useState({});
  // Track if submitted
  const [submitted, setSubmitted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Handle selecting a row for marking
  const handleSelectRow = (qIndex) => {
    setSelectedRow(qIndex);
  };

  // Handle marking logic per requirements
  const handleMark = (questionId, schoolId, value) => {
    setMarkings(prev => {
      const prevRow = prev[questionId] || {};
      // If already marked as correct or two wrongs, do nothing
      const attempts = Object.values(prevRow).filter(v => v.status === 'wrong').length;
      const alreadyCorrect = Object.values(prevRow).some(v => v.status === 'correct');
      if (prevRow[schoolId]) return prev; // No multiple responses for same cell

      if (alreadyCorrect && value === true) return prev; // Only one correct per row

      if (value === true) {
        // Mark as correct
        let marks = 10;
        if (attempts === 1) marks = 5;
        if (attempts > 1) return prev; // No correct after two wrongs
        return {
          ...prev,
          [questionId]: {
            ...prevRow,
            [schoolId]: { status: 'correct', attempt: attempts + 1, marks }
          }
        };
      } else {
        // Mark as wrong
        if (attempts >= 2) return prev; // Only two wrongs allowed
        let marks = attempts === 0 ? -5 : 0;
        return {
          ...prev,
          [questionId]: {
            ...prevRow,
            [schoolId]: { status: 'wrong', attempt: attempts + 1, marks }
          }
        };
      }
    });
  };

  // Handle submit
  const handleSubmit = () => {
    setSubmitted(true);
    setAlertMsg('Marks submitted!\n' + JSON.stringify(markings, null, 2));
    setAlertOpen(true);
    // Here you would send `markings` to backend
  };

  // Helper: get marks for a school in a question
  const getCellMark = (questionId, schoolId) => {
    const cell = markings[questionId]?.[schoolId];
    if (!cell) return null;
    if (cell.status === 'correct') return cell.marks;
    if (cell.status === 'wrong') return cell.marks;
    return null;
  };

  // Helper: get status for a school in a question
  const getCellStatus = (questionId, schoolId) => {
    return markings[questionId]?.[schoolId]?.status;
  };

  // Helper: get number of wrongs in a row
  const getWrongCount = (questionId) => {
    return Object.values(markings[questionId] || {}).filter(v => v.status === 'wrong').length;
  };

  // Helper: get which school is correct in a row
  const getCorrectSchool = (questionId) => {
    const row = markings[questionId] || {};
    return Object.keys(row).find(sid => row[sid].status === 'correct');
  };

  return (
    <div className="w-full flex justify-center items-center">
      <CustomAlert open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMsg} />
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
                          src={school.avatar?.url || '/c-logo.png'}
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
                const wrongCount = getWrongCount(question._id);
                return (
                  <tr
                    key={question._id}
                    className={
                      selectedRow === qIndex
                        ? "bg-purple-50 cursor-pointer"
                        : qIndex % 2 === 0
                          ? "bg-gray-50 cursor-pointer"
                          : "cursor-pointer"
                    }
                    onClick={() => setSelectedRow(qIndex)}
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
                      const cellMark = getCellMark(question._id, school._id);
                      const isRowActive = selectedRow === qIndex && !correctSchool && wrongCount < 2;
                      return (
                        <td key={`${question._id}-${school._id}`} className="py-2 px-3 text-center border-l border-black/20 min-w-[120px]">
                          {isRowActive && !cellStatus ? (
                            <div className="flex justify-center gap-1">
                              <button
                                className="p-1 rounded bg-green-500 text-white"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleMark(question._id, school._id, true);
                                }}
                              >
                                <FaCheck size={12} />
                              </button>
                              <button
                                className="p-1 rounded bg-red-500 text-white"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleMark(question._id, school._id, false);
                                }}
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ) : cellStatus === 'correct' ? (
                            <span className="text-green-500 font-bold">
                              ✓ {cellMark !== undefined ? `(${cellMark})` : ''}
                            </span>
                          ) : cellStatus === 'wrong' ? (
                            <span className="text-red-500 font-bold">
                              ✗ {cellMark !== undefined && cellMark < 0 ? `(${cellMark})` : ''}
                            </span>
                          ) : (
                            <span>-</span>
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
                    const cell = markings[q._id]?.[school._id];
                    if (cell && typeof cell.marks === 'number') {
                      total += cell.marks;
                    }
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
        <div className="flex justify-end mt-6 px-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-sky-600 text-white rounded-md text-base font-semibold"
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? "Submitted" : "Submit"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BattleBreakersTable;