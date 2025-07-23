
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import JudgeLayout from '../JudgeLayout';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import { FaCheck, FaTimes } from 'react-icons/fa';

// Mock data (should be replaced with real API data in production)
const mockQuestions = [
  { _id: '1', question: 'What is a firewall in network security?', answer: 'A network security device that monitors and filters incoming and outgoing network traffic.' },
  { _id: '2', question: 'What is the purpose of DNS?', answer: 'Domain Name System translates human-readable domain names to IP addresses.' },
  { _id: '3', question: 'What is a subnet mask used for?', answer: 'It divides an IP address into network and host portions.' },
  { _id: '4', question: 'What is DHCP?', answer: 'Dynamic Host Configuration Protocol automatically assigns IP addresses to devices on a network.' },
  { _id: '5', question: 'What is the difference between TCP and UDP?', answer: 'TCP is connection-oriented and guarantees delivery, while UDP is connectionless and doesn\'t guarantee delivery.' },
];
const mockSchools = [
  { _id: '1', nameInShort: 'SMC', name: 'St. Mary\'s College', avatar: { url: '/c-logo.png' } },
  { _id: '2', nameInShort: 'RCG', name: 'Royal College Gampaha', avatar: { url: '/c-logo.png' } },
  { _id: '3', nameInShort: 'STC', name: 'St. Thomas\' College', avatar: { url: '/c-logo.png' } },
  { _id: '4', nameInShort: 'ANC', name: 'Ananda College', avatar: { url: '/c-logo.png' } },
  { _id: '5', nameInShort: 'DSC', name: 'D.S. Senanayake College', avatar: { url: '/c-logo.png' } },
];

const BattleBreakersJudge = () => {
  const [questions] = useState(mockQuestions);
  const [schools] = useState(mockSchools);
  const [answerHistory, setAnswerHistory] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [schoolAnswers, setSchoolAnswers] = useState({});
  const [correctSchool, setCorrectSchool] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState({});
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [showQuestionText, setShowQuestionText] = useState(true);
  const tableRef = useRef(null);

  // Mark answer for a school
  const handleMarkAnswer = (schoolId, isCorrect) => {
    if (correctSchool !== null) return;
    if (totalAttempts >= 3 && !isCorrect) return;
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;

    if (isCorrect) {
      setSchoolAnswers(prev => ({ ...prev, [schoolId]: true }));
      setCorrectSchool(schoolId);
      setAnswerHistory(prev => ({
        ...prev,
        [currentQuestionId]: {
          ...prev[currentQuestionId],
          [schoolId]: true,
          correctSchool: schoolId
        }
      }));
    } else {
      setSchoolAnswers(prev => ({ ...prev, [schoolId]: false }));
      setTotalAttempts(prev => prev + 1);
      setWrongAttempts(prev => ({ ...prev, [schoolId]: (prev[schoolId] || 0) + 1 }));
      setAnswerHistory(prev => {
        const questionAnswers = prev[currentQuestionId] || {};
        const schoolAttempts = questionAnswers[`${schoolId}_attempts`] || 0;
        return {
          ...prev,
          [currentQuestionId]: {
            ...questionAnswers,
            [schoolId]: false,
            [`${schoolId}_attempts`]: schoolAttempts + 1
          }
        };
      });
    }
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSchoolAnswers({});
      setCorrectSchool(null);
      setTotalAttempts(0);
      setWrongAttempts({});
    }
  };
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSchoolAnswers({});
      setCorrectSchool(null);
      setTotalAttempts(0);
      setWrongAttempts({});
    }
  };

  return (
    <JudgeLayout gameName="Battle Breakers">
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold mb-4">Battle Breakers Judging Panel</h2>
        <p>Review and score battle submissions for each school and question below.</p>
        <AdminBox title="Teams">
          <div className="flex flex-col space-y-4 mt-2">
            <img src="/under-line.png" alt="underline" className="w-full h-1" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Table showing all school teams</div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setShowQuestionText(!showQuestionText)}
                  className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                >
                  {showQuestionText ? 'Hide Question Text' : 'Show Question Text'}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto mt-2 max-w-full">
              <table ref={tableRef} className="w-full bg-white border border-gray-300 rounded-lg" style={{ tableLayout: 'auto', minWidth: '100%' }}>
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-1 px-2 border-b text-left font-medium text-purple-800 relative" style={{ minWidth: '100px' }}>
                      {showQuestionText ? '#  Question' : '#'}
                    </th>
                    {schools.map((school) => (
                      <th key={school._id} className="py-1 px-1 border-b text-center font-medium text-purple-800 text-xs relative" style={{ minWidth: '50px' }}>
                        {school.nameInShort}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, qIndex) => (
                    <tr key={question._id} className={qIndex === currentQuestionIndex ? "bg-purple-50" : qIndex % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-2 border-b border-r" style={{ maxWidth: '220px' }}>
                        {showQuestionText ? (
                          <div className="truncate">
                            <span className="font-bold mr-2">{qIndex + 1}.</span>
                            {question.question}
                          </div>
                        ) : (
                          <div className="truncate text-xs font-bold">Q{qIndex + 1}</div>
                        )}
                      </td>
                      {schools.map((school) => (
                        <td key={`${question._id}-${school._id}`} className="py-2 px-2 border-b text-center" style={{ minWidth: '50px' }}>
                          {qIndex === currentQuestionIndex ? (
                            <div className="flex justify-center gap-1">
                              {isQuestionActive ? (
                                <>
                                  {correctSchool === null ? (
                                    totalAttempts >= 3 ? (
                                      <span className="text-red-500 font-medium text-xs">X</span>
                                    ) : (
                                      <>
                                        <button
                                          className={`p-1 rounded ${schoolAnswers[school._id] === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                          onClick={() => handleMarkAnswer(school._id, true)}
                                        >
                                          <FaCheck size={12} />
                                        </button>
                                        <button
                                          className={`p-1 rounded ${schoolAnswers[school._id] === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                          onClick={() => handleMarkAnswer(school._id, false)}
                                        >
                                          <FaTimes size={12} />
                                        </button>
                                        {schoolAnswers[school._id] === false && (wrongAttempts[school._id] || 0) > 0 && (
                                          <span className="text-xs text-red-500 font-medium">
                                            {wrongAttempts[school._id]}
                                          </span>
                                        )}
                                      </>
                                    )
                                  ) : correctSchool === school._id ? (
                                    <span className="text-green-500 font-bold text-lg">✓</span>
                                  ) : schoolAnswers[school._id] === false ? (
                                    <span className="text-red-500 font-bold text-lg">✗</span>
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {schoolAnswers[school._id] === true ? (
                                    <span className="text-green-500 font-bold">✓</span>
                                  ) : schoolAnswers[school._id] === false ? (
                                    <span className="text-red-500 font-bold">✗</span>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </>
                              )}
                            </div>
                          ) : (
                            <>
                              {answerHistory[question._id] && answerHistory[question._id][school._id] === true ? (
                                <span className="text-green-500 font-bold">✓</span>
                              ) : answerHistory[question._id] && answerHistory[question._id][school._id] === false ? (
                                <div>
                                  <span className="text-red-500 font-bold">✗</span>
                                  {answerHistory[question._id][`${school._id}_attempts`] > 0 && (
                                    <span className="text-xs text-red-500">
                                      {answerHistory[question._id][`${school._id}_attempts`]}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span>-</span>
                              )}
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 ${isQuestionActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'} rounded-md text-sm font-medium`}
                onClick={() => setIsQuestionActive((prev) => !prev)}
              >
                {isQuestionActive ? 'Stop Marking' : 'Start Marking'}
              </motion.button>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-sky-600 text-white rounded-md text-base font-semibold"
                onClick={() => alert('Marks submitted!')}
              >
                Submit
              </motion.button>
            </div>
          </div>
        </AdminBox>
      </div>
    </JudgeLayout>
  );
};

export default BattleBreakersJudge;
