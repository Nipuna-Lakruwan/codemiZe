import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';

const RouteSeekersJudge = () => {
  // Main states
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'marking', 'completed'
  const [selectedCard, setSelectedCard] = useState(null); // null, 'questionnaire', 'network-design'
  const [activeSchool, setActiveSchool] = useState(null);

  // Schools, criteria and markings
  const [schools, setSchools] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [markings, setMarkings] = useState({});

  // Questionnaire states
  const [viewingQuestions, setViewingQuestions] = useState(false);
  const [schoolQuestions, setSchoolQuestions] = useState([]);

  // Mock criteria for Network Design
  const mockCriteria = [
    { id: 'c1', criteria: 'Network Topology' },
    { id: 'c2', criteria: 'IP Addressing Scheme' },
    { id: 'c3', criteria: 'Routing Configuration' },
    { id: 'c4', criteria: 'Security Implementation' },
    { id: 'c5', criteria: 'Network Scalability' }
  ];

  // Mock schools data
  const mockSchools = [
    { id: 's1', name: 'Royal College', nameInShort: 'RC', avatar: { url: '/c-logo.png' } },
    { id: 's2', name: 'Ananda College', nameInShort: 'AC', avatar: { url: '/c-logo.png' } },
    { id: 's3', name: 'St. Joseph\'s College', nameInShort: 'SJC', avatar: { url: '/c-logo.png' } },
    { id: 's4', name: 'D.S. Senanayake College', nameInShort: 'DSC', avatar: { url: '/c-logo.png' } },
    { id: 's5', name: 'Visakha Vidyalaya', nameInShort: 'VV', avatar: { url: '/c-logo.png' } },
    { id: 's6', name: 'Nalanda College', nameInShort: 'NC', avatar: { url: '/c-logo.png' } },
    { id: 's7', name: 'Mahanama College', nameInShort: 'MC', avatar: { url: '/c-logo.png' } },
    { id: 's8', name: 'Isipathana College', nameInShort: 'IC', avatar: { url: '/c-logo.png' } },
    { id: 's9', name: 'St. Thomas\' College', nameInShort: 'STC', avatar: { url: '/c-logo.png' } },
    { id: 's10', name: 'Dharmaraja College', nameInShort: 'DRC', avatar: { url: '/c-logo.png' } }
  ];

  // Mock questions data for questionnaire
  const mockQuestionsList = [
    {
      id: 1,
      question: "What is the primary protocol used for web communication?",
      correctAnswer: "HTTP/HTTPS",
      answer: "HTTP protocol",
      status: null // null, 'correct', or 'incorrect'
    },
    {
      id: 2,
      question: "What does DNS stand for?",
      correctAnswer: "Domain Name System",
      answer: "Domain Name System",
      status: null
    },
    {
      id: 3,
      question: "What is the default port for HTTP?",
      correctAnswer: "80",
      answer: "Port 80",
      status: null
    },
    {
      id: 4,
      question: "What does IP stand for in IP Address?",
      correctAnswer: "Internet Protocol",
      answer: "Internet Protocol",
      status: null
    },
    {
      id: 5,
      question: "What is a subnet mask used for?",
      correctAnswer: "To divide an IP address into network and host portions",
      answer: "It helps to identify which part of an IP address refers to the network",
      status: null
    },
    {
      id: 6,
      question: "What is the purpose of a router in a network?",
      correctAnswer: "To forward data packets between computer networks",
      answer: "To connect different networks and forward data packets between them",
      status: null
    },
    {
      id: 7,
      question: "What is the OSI model?",
      correctAnswer: "A conceptual framework used to describe network communication functions",
      answer: "A 7-layer model that describes how networks function",
      status: null
    }
  ];

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          // For demo purposes, show game ready state
          const status = 'marking';
          setGameStatus(status);

          if (status === 'marking') {
            setSchools(mockSchools);
            setCriteria(mockCriteria);

            // Initialize empty markings for all schools
            const initialMarkings = {};
            mockSchools.forEach(school => {
              initialMarkings[school.id] = {};
              mockCriteria.forEach(criterion => {
                initialMarkings[school.id][criterion.id] = 0;
              });
            });
            setMarkings(initialMarkings);
          }

          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle card selection
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    if (card === 'questionnaire') {
      setViewingQuestions(false);
      setActiveSchool(null);
    }
  };

  // Handle mark updates
  const handleMarkUpdate = (schoolId, criteriaId, mark) => {
    setMarkings(prevMarkings => ({
      ...prevMarkings,
      [schoolId]: {
        ...prevMarkings[schoolId],
        [criteriaId]: mark
      }
    }));
  };

  // Handle keydown to validate input
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, and numbers
    if (
      ![8, 9, 13, 27, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(e.keyCode) &&
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      !(e.ctrlKey === true && [65, 67, 86, 88].includes(e.keyCode)) &&
      // Allow: home, end, left, right
      !(e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      e.preventDefault();
    }
  };

  // Handle viewing school questions
  const handleViewSchoolQuestions = (school) => {
    setActiveSchool(school);
    setViewingQuestions(true);
    setSchoolQuestions(mockQuestionsList);
  };

  // Handle marking question as correct/incorrect
  const handleMarkQuestion = (index, status) => {
    const updatedQuestions = [...schoolQuestions];
    updatedQuestions[index].status = status;
    setSchoolQuestions(updatedQuestions);
  };

  // Calculate total score for a school
  const calculateTotal = (schoolId) => {
    if (!markings[schoolId]) return 0;
    return Object.values(markings[schoolId]).reduce((sum, mark) => sum + mark, 0);
  };

  // Go back from questions view to schools list
  const handleBackToSchools = () => {
    setViewingQuestions(false);
    setActiveSchool(null);
  };

  return (
    <JudgeLayout gameName="Route Seekers">
      <ScrollbarStyles />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="text-gray-800 h-full">
          {gameStatus === 'waiting' ? (
            // Game is in waiting state - show waiting message
            <div className="flex flex-col items-center justify-center h-full">
              <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
              <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                Waiting For Submissions
              </div>
              <p className="text-gray-500 mt-4">Route Seekers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
            </div>
          ) : selectedCard === null ? (
            // Show the two main cards for selection
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-8">Route Seekers Judging</h2>

              <div className="flex space-x-12">
                {/* Questionnaire Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg shadow-lg p-6 w-64 h-80 cursor-pointer flex flex-col items-center justify-center"
                  onClick={() => handleCardSelect('questionnaire')}
                >
                  <img
                    src="/quiz_hunters_logo-removebg 1.png"
                    alt="Questionnaire"
                    className="h-32 w-32 mb-4 object-contain"
                  />
                  <h3 className="text-xl font-bold text-center">Questionnaire</h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Review and mark student responses to network-related questions
                  </p>
                </motion.div>

                {/* Network Design Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg shadow-lg p-6 w-64 h-80 cursor-pointer flex flex-col items-center justify-center"
                  onClick={() => handleCardSelect('network-design')}
                >
                  <img
                    src="/circuit samshers logo 1.png"
                    alt="Network Design"
                    className="h-32 w-32 mb-4 object-contain"
                  />
                  <h3 className="text-xl font-bold text-center">Network Design</h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Score network designs submitted by teams based on technical criteria
                  </p>
                </motion.div>
              </div>
            </div>
          ) : selectedCard === 'questionnaire' ? (
            // Questionnaire view
            <div className="w-full">
              {!viewingQuestions ? (
                // Show list of schools to select from
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">School Questionnaire Responses</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                      onClick={() => setSelectedCard(null)}
                    >
                      Back to Selection
                    </motion.button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pb-4">
                    {schools.map(school => (
                      <div
                        key={school.id}
                        className="w-full h-16 bg-white rounded-md shadow-md border-l-[15px] border-sky-400 flex items-center"
                      >
                        {/* School Logo */}
                        <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center">
                          <img
                            src={school.avatar?.url || "/c-logo.png"}
                            alt={school.name}
                            className="max-w-full max-h-full object-cover"
                          />
                        </div>

                        {/* School Info */}
                        <div className="flex-1 px-4">
                          <div className="text-black text-base font-medium">
                            {school.name}
                          </div>
                          <div className="text-black/70 text-xs">
                            {school.nameInShort}
                          </div>
                        </div>

                        {/* View Button */}
                        <div className="pr-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewSchoolQuestions(school)}
                            className="w-20 h-7 bg-purple-900 rounded text-white text-xs flex items-center justify-center"
                          >
                            View
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Show questions for selected school
                <div className="w-full max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handleBackToSchools}
                      className="flex items-center text-gray-600 hover:text-black"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="text-sm font-medium">Back to schools</span>
                    </button>

                    <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
                      <div>
                        <div className="text-black text-base font-medium text-right">
                          {activeSchool.name}
                        </div>
                        <div className="text-black/70 text-xs font-medium text-right">
                          {activeSchool.nameInShort}
                        </div>
                      </div>
                      <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center ml-3">
                        <img
                          src={activeSchool.avatar?.url || "/c-logo.png"}
                          alt={activeSchool.name}
                          className="max-w-full max-h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Questionnaire Responses</h3>

                    <div className="space-y-6 mt-8 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {schoolQuestions.map((item, index) => (
                        <div key={index} className="mb-4">
                          {/* Question */}
                          <div className="text-black text-sm font-bold mb-2">
                            {index + 1}. {item.question}
                          </div>

                          {/* Answer section */}
                          <div className="flex items-center justify-between flex-wrap">
                            <div className="text-black/80 text-sm flex-1 min-w-[250px] mr-4">
                              <span className="font-medium">Answer:</span> {item.answer}
                            </div>

                            {/* Marking buttons */}
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <button
                                onClick={() => handleMarkQuestion(index, 'correct')}
                                className={`${item.status === 'correct' ? 'bg-green-100' : ''} p-2 rounded-md hover:bg-green-50`}
                                title="Mark as correct"
                              >
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleMarkQuestion(index, 'incorrect')}
                                className={`${item.status === 'incorrect' ? 'bg-red-100' : ''} p-2 rounded-md hover:bg-red-50`}
                                title="Mark as incorrect"
                              >
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Divider */}
                          {index < schoolQuestions.length - 1 && (
                            <div className="w-full h-0 border-t border-black/10 mt-4"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
                      >
                        Submit Marks
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Network Design view (similar to Circuit Smashers)
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Network Design Marking</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                  onClick={() => setSelectedCard(null)}
                >
                  Back to Selection
                </motion.button>
              </div>
              <p className="text-gray-500 text-sm mb-6">Score each school's network design submission based on the criteria below. Enter a number from 0-10 in each cell.</p>

              {/* Marking Table with Fixed First Column */}
              <div className="w-full max-w-[1500px] h-[600px] bg-white rounded-[5px] border border-black/90 mx-auto">
                {/* Table container with horizontal scroll */}
                <div className="overflow-x-auto w-full h-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9333ea #f3f4f6' }}>
                  <table className="w-max bg-white" style={{ minWidth: '1400px' }}>
                    <thead>
                      <tr className="bg-gray-100 border-b border-black/20">
                        <th className="py-3 px-4 text-left text-sm font-medium text-purple-800 w-40 sticky left-0 bg-gray-100 z-10">Criteria</th>
                        {schools.map((school) => (
                          <th key={school.id} className="py-2 px-3 text-center text-sm font-medium text-purple-800 border-l border-black/20 min-w-[120px]">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                                <img
                                  src={school.avatar?.url || '/c-logo.png'}
                                  alt={school.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs font-medium">{school.nameInShort}</span>
                              <span className="text-[10px] text-gray-500 mb-1 truncate max-w-[110px]" title={school.name}>{school.name}</span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-1 text-[10px] bg-sky-600 text-white px-2 py-1 rounded text-center"
                              >
                                Download
                              </motion.button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((criterion) => (
                        <tr key={criterion.id} className="border-b border-black/20">
                          <td className="py-3 px-4 text-sm font-medium sticky left-0 bg-white border-r border-black/20 z-10">
                            {criterion.criteria}
                          </td>
                          {schools.map((school) => (
                            <td key={`${school.id}-${criterion.id}`} className="py-2 px-3 text-center border-l border-black/20">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={markings[school.id]?.[criterion.id] || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow empty input for clearing
                                  if (value === '') {
                                    handleMarkUpdate(school.id, criterion.id, 0);
                                  } else {
                                    // Parse to number and limit between 0 and 10
                                    const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
                                    handleMarkUpdate(school.id, criterion.id, numValue);
                                  }
                                }}
                                onKeyDown={handleKeyDown}
                                className="w-14 h-9 border border-gray-300 rounded text-center font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                                aria-label={`Score for ${school.name} on ${criterion.criteria}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-purple-50">
                        <td className="py-3 px-4 text-sm font-bold text-purple-800 sticky left-0 bg-purple-50 border-r border-black/20 z-10">
                          Total Score
                        </td>
                        {schools.map((school) => (
                          <td key={`${school.id}-total`} className="py-2 px-3 text-center font-bold text-purple-800 border-l border-black/20">
                            {calculateTotal(school.id)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
                >
                  Submit All Marks
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}
    </JudgeLayout>
  );
};

export default RouteSeekersJudge;
