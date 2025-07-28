import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaPlus, FaEye, FaClock, FaPlayCircle, FaStopCircle, FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';

// Mock data for demonstration
const mockQuestions = [
  { _id: '1', question: 'What is a firewall in network security?', answer: 'A network security device that monitors and filters incoming and outgoing network traffic.' },
  { _id: '2', question: 'What is the purpose of DNS?', answer: 'Domain Name System translates human-readable domain names to IP addresses.' },
  { _id: '3', question: 'What is a subnet mask used for?', answer: 'It divides an IP address into network and host portions.' },
  { _id: '4', question: 'What is DHCP?', answer: 'Dynamic Host Configuration Protocol automatically assigns IP addresses to devices on a network.' },
  { _id: '5', question: 'What is the difference between TCP and UDP?', answer: 'TCP is connection-oriented and guarantees delivery, while UDP is connectionless and doesn\'t guarantee delivery.' },
  { _id: '6', question: 'What is an IP address?', answer: 'A numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication.' },
  { _id: '7', question: 'What is a router?', answer: 'A device that forwards data packets between computer networks.' },
  { _id: '8', question: 'What is a VPN?', answer: 'Virtual Private Network extends a private network across a public network, enabling users to send and receive data as if their devices were directly connected to the private network.' }
];

const mockSchools = [
  { _id: '1', nameInShort: 'SMC', name: 'St. Mary\'s College', avatar: { url: '/c-logo.png' } },
  { _id: '2', nameInShort: 'RCG', name: 'Royal College Gampaha', avatar: { url: '/c-logo.png' } },
  { _id: '3', nameInShort: 'STC', name: 'St. Thomas\' College', avatar: { url: '/c-logo.png' } },
  { _id: '4', nameInShort: 'ANC', name: 'Ananda College', avatar: { url: '/c-logo.png' } },
  { _id: '5', nameInShort: 'DSC', name: 'D.S. Senanayake College', avatar: { url: '/c-logo.png' } },
  { _id: '6', nameInShort: 'VIS', name: 'Vishaka Vidyalaya', avatar: { url: '/c-logo.png' } },
  { _id: '7', nameInShort: 'DMS', name: 'Devi Balika Vidyalaya', avatar: { url: '/c-logo.png' } },
  { _id: '8', nameInShort: 'ISC', name: 'Isipathana College', avatar: { url: '/c-logo.png' } },
  { _id: '9', nameInShort: 'MUS', name: 'Muslim Ladies College', avatar: { url: '/c-logo.png' } },
  { _id: '10', nameInShort: 'NAL', name: 'Nalanda College', avatar: { url: '/c-logo.png' } },
  { _id: '11', nameInShort: 'THR', name: 'Thurstan College', avatar: { url: '/c-logo.png' } },
  { _id: '12', nameInShort: 'MAH', name: 'Mahanama College', avatar: { url: '/c-logo.png' } },
];

export default function AdminBattleBreakers() {
  const [activeTab, setActiveTab] = useState('Upload');
  const [questions, setQuestions] = useState(mockQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [schools, setSchools] = useState(mockSchools);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [schoolAnswers, setSchoolAnswers] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctSchool, setCorrectSchool] = useState(null);
  const [allocatedTime, setAllocatedTime] = useState(60);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [answerHistory, setAnswerHistory] = useState({}); // Store answer history for all questions
  const [showQuestionText, setShowQuestionText] = useState(true); // Toggle to show/hide question text
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const tableRef = useRef(null);

  // Timer effect for countdown and track attempts
  useEffect(() => {
    if (isQuestionActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Don't stop the question when time is up, just clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isQuestionActive, timeRemaining]);

  // Effect to track total attempts
  useEffect(() => {
    // If we've used all 3 attempts, make sure buttons stay disabled but don't auto-proceed
    // User must explicitly click "Next" button
    if (totalAttempts >= 3) {
      // Stop the timer if it's running
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [totalAttempts]);

  // Effect to load question state when currentQuestionIndex changes
  useEffect(() => {
    if (!isQuestionActive) {
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && answerHistory[currentQuestionId]) {
        const savedAnswers = answerHistory[currentQuestionId];

        // Extract only school answers
        const schoolAnswersFromHistory = {};
        schools.forEach(school => {
          if (savedAnswers[school._id] !== undefined) {
            schoolAnswersFromHistory[school._id] = savedAnswers[school._id];
          }
        });

        setSchoolAnswers(schoolAnswersFromHistory);
        setCorrectSchool(savedAnswers.correctSchool || null);
        setTotalAttempts(savedAnswers.totalAttempts || 0);
      }
    }
  }, [currentQuestionIndex, questions, answerHistory, schools, isQuestionActive]);

  // Filter questions when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuestions(questions);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredQuestions(questions.filter(q =>
        q.question.toLowerCase().includes(lowercasedSearch) ||
        q.answer.toLowerCase().includes(lowercasedSearch)
      ));
    }
  }, [searchTerm, questions]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Simulate file upload - in a real application, this would parse the CSV
    setTimeout(() => {
      // Add some sample questions as if they were loaded from CSV
      const newQuestions = [
        { _id: `${Date.now()}-1`, question: 'What is NAT?', answer: 'Network Address Translation is a method of mapping an IP address space into another.' },
        { _id: `${Date.now()}-2`, question: 'What is a MAC address?', answer: 'Media Access Control address is a unique identifier assigned to a network interface controller.' },
        { _id: `${Date.now()}-3`, question: 'What is a switch?', answer: 'A network device that connects devices within a network and uses MAC addresses to forward data to the right destination.' },
      ];

      setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
      alert('Questions uploaded successfully!');
    }, 1000);
  };

  const handleAddQuestion = () => {
    if (!questionText.trim() || !answerText.trim()) {
      alert('Question and answer are required!');
      return;
    }

    if (editingQuestionId) {
      // Update existing question
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q._id === editingQuestionId
            ? { ...q, question: questionText, answer: answerText }
            : q
        )
      );
      setEditingQuestionId(null);
    } else {
      // Add new question
      const newQuestion = {
        _id: `${Date.now()}`,
        question: questionText,
        answer: answerText
      };
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    }

    setQuestionText('');
    setAnswerText('');
    setShowAddQuestionModal(false);
  };

  const handleEditQuestion = (question) => {
    setQuestionText(question.question);
    setAnswerText(question.answer);
    setEditingQuestionId(question._id);
    setShowAddQuestionModal(true);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));

      // If we're deleting the current question, adjust currentQuestionIndex
      if (questions[currentQuestionIndex]?._id === questionId) {
        if (currentQuestionIndex >= questions.length - 1) {
          setCurrentQuestionIndex(Math.max(0, questions.length - 2));
        }
      }
    }
  };

  const startQuestion = () => {
    if (questions.length === 0) return;

    setTimeRemaining(allocatedTime);
    setIsQuestionActive(true);
    setSchoolAnswers({});
    setWrongAttempts({});
    setTotalAttempts(0);
    setCorrectSchool(null);
  };

  const stopQuestion = () => {
    setIsQuestionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save the current state to answer history when question is stopped
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;

    // Save all current answers and the correct school to history
    setAnswerHistory(prev => {
      const questionAnswers = prev[currentQuestionId] || {};
      return {
        ...prev,
        [currentQuestionId]: {
          ...questionAnswers,
          ...schoolAnswers,
          correctSchool,
          totalAttempts,
          timeUsed: allocatedTime - timeRemaining
        }
      };
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current question state to history before moving
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && Object.keys(schoolAnswers).length > 0) {
        setAnswerHistory(prev => ({
          ...prev,
          [currentQuestionId]: {
            ...prev[currentQuestionId],
            ...schoolAnswers,
            correctSchool,
            totalAttempts,
            timeUsed: allocatedTime - timeRemaining
          }
        }));
      }

      setCurrentQuestionIndex(prev => prev + 1);
      setIsQuestionActive(false);

      // Load next question's answers from history if available
      const nextQuestionId = questions[currentQuestionIndex + 1]?._id;
      if (nextQuestionId && answerHistory[nextQuestionId]) {
        const nextAnswers = answerHistory[nextQuestionId];

        // Extract only the school answers from history
        const schoolAnswersFromHistory = {};
        schools.forEach(school => {
          if (nextAnswers[school._id] !== undefined) {
            schoolAnswersFromHistory[school._id] = nextAnswers[school._id];
          }
        });

        setSchoolAnswers(schoolAnswersFromHistory);
        setCorrectSchool(nextAnswers.correctSchool || null);
        setTotalAttempts(nextAnswers.totalAttempts || 0);
      } else {
        setSchoolAnswers({});
        setWrongAttempts({});
        setTotalAttempts(0);
        setCorrectSchool(null);
      }
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current question state to history before moving
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && Object.keys(schoolAnswers).length > 0) {
        setAnswerHistory(prev => ({
          ...prev,
          [currentQuestionId]: {
            ...prev[currentQuestionId],
            ...schoolAnswers,
            correctSchool,
            totalAttempts,
            timeUsed: allocatedTime - timeRemaining
          }
        }));
      }

      setCurrentQuestionIndex(prev => prev - 1);
      setIsQuestionActive(false);

      // Load previous question's answers from history if available
      const prevQuestionId = questions[currentQuestionIndex - 1]?._id;
      if (prevQuestionId && answerHistory[prevQuestionId]) {
        const prevAnswers = answerHistory[prevQuestionId];

        // Extract only the school answers from history
        const schoolAnswersFromHistory = {};
        schools.forEach(school => {
          if (prevAnswers[school._id] !== undefined) {
            schoolAnswersFromHistory[school._id] = prevAnswers[school._id];
          }
        });

        setSchoolAnswers(schoolAnswersFromHistory);
        setCorrectSchool(prevAnswers.correctSchool || null);
        setTotalAttempts(prevAnswers.totalAttempts || 0);
      } else {
        setSchoolAnswers({});
        setWrongAttempts({});
        setTotalAttempts(0);
        setCorrectSchool(null);
      }
    }
  };

  const skipQuestion = () => {
    if (window.confirm('Are you sure you want to skip this question?')) {
      goToNextQuestion();
    }
  };

  const handleMarkAnswer = (schoolId, isCorrect) => {
    // Only allow marking if no correct answer yet and less than 2 wrongs
    if (correctSchool !== null) return;

    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;

    // Count current wrong attempts for this question
    const wrongCount = Object.values(schoolAnswers).filter(v => v === false).length;

    if (isCorrect) {
      // Only allow marking as correct if no correct answer yet and not after two wrongs
      if (wrongCount >= 2) return;
      setSchoolAnswers(prev => ({
        ...prev,
        [schoolId]: true
      }));
      setCorrectSchool(schoolId);

      // Save to answer history
      setAnswerHistory(prev => {
        const questionAnswers = prev[currentQuestionId] || {};
        return {
          ...prev,
          [currentQuestionId]: {
            ...questionAnswers,
            [schoolId]: true,
            correctSchool: schoolId
          }
        };
      });
    } else {
      // Only allow up to 2 wrongs for a question
      if (wrongCount >= 2) return;
      setSchoolAnswers(prev => ({
        ...prev,
        [schoolId]: false
      }));

      // Save to answer history
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Column resizing handlers
  const handleResizeStart = (e, index) => {
    setIsResizing(true);
    setResizeColumnIndex(index);
    setStartX(e.clientX);

    const currentWidth = columnWidths[index] || (index === 0 ? 220 : tableRef.current.clientWidth / (schools.length + 1));
    setStartWidth(currentWidth);

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);

    // Prevent default behavior and text selection during resize
    e.preventDefault();
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px

    setColumnWidths(prev => ({
      ...prev,
      [resizeColumnIndex]: newWidth
    }));
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeColumnIndex(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.userSelect = '';
  };

  // Cleanup resize listeners on component unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  // Update cursor style when resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = '';
    }
  }, [isResizing]);

  return (
    <AdminLayout>
      {activeTab === 'Questions' ? (
        <div className="flex flex-col gap-6 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">All Questions</h2>
            <button
              onClick={() => setActiveTab('Upload')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2 w-1/3">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2 border rounded"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => {
                  setQuestionText('');
                  setAnswerText('');
                  setEditingQuestionId(null);
                  setShowAddQuestionModal(true);
                }}
                className="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-900 transition flex items-center gap-1"
              >
                <FaPlus size={12} />
                Add Question
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left font-medium text-purple-800">#</th>
                    <th className="py-3 px-4 border-b text-left font-medium text-purple-800">Question</th>
                    <th className="py-3 px-4 border-b text-left font-medium text-purple-800">Answer</th>
                    <th className="py-3 px-4 border-b text-center font-medium text-purple-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question, index) => (
                    <tr key={question._id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 border-b">{index + 1}</td>
                      <td className="py-3 px-4 border-b">
                        <div className="max-w-md truncate">{question.question}</div>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="max-w-md truncate">{question.answer}</div>
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No questions found. Add a question or modify your search.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 p-4">
          {/* First Section - Upload, Total Questions, Allocate Time */}
          <div className="flex gap-6">
            {/* Upload Questions Box */}
            <AdminBox title="Upload Questions" width="w-1/3">
              <div className="flex flex-col space-y-4 mt-2">
                {/* Underline */}
                <img src="/under-line.png" alt="underline" className="w-full h-1" />

                <div className="mt-3 mb-3">
                  <div className="flex items-center">
                    <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload CSV File</div>
                    <div className="ml-2">
                      <input
                        type="file"
                        id="questionFile"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".csv"
                      />
                      <label htmlFor="questionFile" className="cursor-pointer">
                        <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                          <FaUpload size={10} className="text-white" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all questions?')) {
                          setQuestions([]);
                        }
                      }}
                      className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                      disabled={questions.length === 0}
                    >
                      Delete All
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setQuestionText('');
                        setAnswerText('');
                        setEditingQuestionId(null);
                        setShowAddQuestionModal(true);
                      }}
                      className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    >
                      Add Question
                    </motion.button>
                  </div>
                </div>
              </div>
            </AdminBox>

            {/* Total Questions Box */}
            <AdminBox title="Total Questions" width="w-1/3">
              <div className="flex flex-col space-y-4 mt-2">
                {/* Underline */}
                <img src="/under-line.png" alt="underline" className="w-full h-1" />

                <div className="flex flex-col items-center mt-4">
                  <div className="justify-start text-purple-800 text-5xl font-semibold font-['Inter']">
                    {questions.length}
                  </div>
                  <div className="justify-start text-sky-600 text-xl font-semibold font-['Oxanium']">
                    Questions
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Questions')}
                    className="mt-4 w-48 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center gap-1"
                    disabled={questions.length === 0}
                  >
                    <FaEye size={12} />
                    View All Questions
                  </motion.button>
                </div>
              </div>
            </AdminBox>

            {/* Allocate Time Box */}
            <AdminBox title="Allocate Time" width="w-1/3">
              <div className="flex flex-col space-y-4 mt-2">
                {/* Underline */}
                <img src="/under-line.png" alt="underline" className="w-full h-1" />

                <div className="flex flex-col items-center mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-purple-800" size={24} />
                    <div className="text-2xl font-semibold">{allocatedTime} sec</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAllocatedTime(prev => Math.max(10, prev - 10))}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      -10s
                    </button>
                    <button
                      onClick={() => setAllocatedTime(prev => Math.min(300, prev + 10))}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +10s
                    </button>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-500">Set time for each question</span>
                  </div>
                </div>
              </div>
            </AdminBox>
          </div>

          {/* Second Section - Current Question */}
          <AdminBox title="Current Question">
            <div className="flex flex-col space-y-4 mt-2">
              {/* Underline */}
              <img src="/under-line.png" alt="underline" className="w-full h-1" />

              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-semibold mb-2">Question:</h3>
                <p className="text-lg">{questions[currentQuestionIndex]?.question || "No question available"}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Answer:</h3>
                <p className="text-lg">{questions[currentQuestionIndex]?.answer || "No answer available"}</p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevQuestion}
                    className="px-4 py-2 bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentQuestionIndex === 0}
                  >
                    <FaChevronLeft />
                    Previous
                  </button>
                  <button
                    onClick={goToNextQuestion}
                    className="px-4 py-2 bg-gray-200 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <FaChevronRight />
                  </button>
                  {isQuestionActive && (
                    <button
                      onClick={skipQuestion}
                      className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center gap-1"
                    >
                      Skip Question
                    </button>
                  )}
                </div>

                {isQuestionActive ? (
                  <button
                    onClick={stopQuestion}
                    className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-1"
                  >
                    <FaStopCircle />
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={startQuestion}
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-1"
                    disabled={questions.length === 0}
                  >
                    <FaPlayCircle />
                    Start
                  </button>
                )}

                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 px-4 py-2 rounded">
                    <span className="font-semibold">Time Remaining: </span>
                    <span className={timeRemaining < 10 ? "text-red-600 font-bold" : ""}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  {/* Removed Attempt Remaining yellow section */}
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeRemaining / allocatedTime) * 100}%` }}
                ></div>
              </div>
            </div>
          </AdminBox>

          {/* Third Section - Teams and Answers Table */}
          <AdminBox title="Teams">
            <div className="flex flex-col space-y-4 mt-2">
              {/* Underline */}
              <img src="/under-line.png" alt="underline" className="w-full h-1" />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">Table showing all 12 school teams</div>
                <div className="flex gap-2 items-center">
                  {isResizing && (
                    <span className="text-xs text-purple-800 italic">Resizing column...</span>
                  )}
                  <button
                    onClick={() => setColumnWidths({})}
                    className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    title="Reset column widths to default"
                  >
                    Reset Columns
                  </button>
                  <button
                    onClick={() => setShowQuestionText(!showQuestionText)}
                    className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {showQuestionText ? 'Hide Question Text' : 'Show Question Text'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mt-2 max-w-full">
                <table ref={tableRef} className="w-full bg-white border border-gray-300 rounded-lg"
                  style={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <thead>
                    <tr className="bg-gray-100">
                      <th
                        className="py-1 px-2 border-b text-left font-medium text-purple-800 relative"
                        style={{ width: columnWidths[0] || '220px', minWidth: '100px' }}
                      >
                        {showQuestionText ? '#  Question' : '#'}
                        <div
                          className="absolute top-0 right-0 h-full w-2 cursor-col-resize opacity-0 hover:opacity-100 hover:bg-purple-300"
                          onMouseDown={(e) => handleResizeStart(e, 0)}
                        ></div>
                      </th>
                      {schools.map((school, index) => (
                        <th
                          key={school._id}
                          className="py-1 px-1 border-b text-center font-medium text-purple-800 text-xs relative"
                          style={{
                            width: columnWidths[index + 1] || `${100 / (schools.length + 1)}%`,
                            minWidth: '50px'
                          }}
                        >
                          {school.nameInShort}
                          <div
                            className="absolute top-0 right-0 h-full w-2 cursor-col-resize opacity-0 hover:opacity-100 hover:bg-purple-300"
                            onMouseDown={(e) => handleResizeStart(e, index + 1)}
                          ></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question, qIndex) => (
                      <tr
                        key={question._id}
                        className={qIndex === currentQuestionIndex ? "bg-purple-50" : qIndex % 2 === 0 ? "bg-gray-50" : ""}
                        title={!showQuestionText ? `${question.question}\nAnswer: ${question.answer}` : `Answer: ${question.answer}`}>
                        <td className="py-2 px-2 border-b border-r" style={{ width: columnWidths[0] || '220px', maxWidth: columnWidths[0] || '220px' }}>
                          {showQuestionText ? (
                            <div className="truncate">
                              <span className="font-bold mr-2">{qIndex + 1}.</span>
                              {question.question}
                            </div>
                          ) : (
                            <div className="truncate text-xs font-bold">Q{qIndex + 1}</div>
                          )}
                          {answerHistory[question._id]?.correctSchool && qIndex !== currentQuestionIndex && (
                            <div className="mt-1">
                              <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                By {schools.find(s => s._id === answerHistory[question._id]?.correctSchool)?.nameInShort || ''}
                              </span>
                            </div>
                          )}
                          {qIndex === currentQuestionIndex && (
                            <div className="text-xs font-semibold text-purple-800">Current</div>
                          )}
                        </td>

                        {schools.map((school, index) => (
                          <td
                            key={`${question._id}-${school._id}`}
                            className="py-2 px-2 border-b text-center"
                            style={{
                              width: columnWidths[index + 1] || `${100 / (schools.length + 1)}%`,
                              minWidth: '50px'
                            }}>
                            {qIndex === currentQuestionIndex ? (
                              /* Current Question Row */
                              <div className="flex justify-center gap-1">
                                {isQuestionActive ? (
                                  /* Active Question - Show buttons */
                                  (() => {
                                    // Count wrongs for this row
                                    const wrongCount = Object.values(schoolAnswers).filter(v => v === false).length;
                                    // If correctSchool is selected or two wrongs, lock the row
                                    if (correctSchool !== null || wrongCount >= 2) {
                                      // Show result icons only
                                      if (correctSchool === school._id) {
                                        return <span className="text-green-500 font-bold text-lg">✓</span>;
                                      }
                                      if (schoolAnswers[school._id] === false) {
                                        return <span className="text-red-500 font-bold text-lg">✗</span>;
                                      }
                                      return <span className="text-gray-500">-</span>;
                                    }
                                    // Normal state with both buttons available
                                    return (
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
                                        {/* Removed wrong attempt indicator number */}
                                      </>
                                    );
                                  })()
                                ) : (
                                  /* Non-active current question - Show result icons */
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
                              /* Past or future question - Show results from history if available */
                              <>
                                {answerHistory[question._id] && answerHistory[question._id][school._id] === true ? (
                                  <span className="text-green-500 font-bold">✓</span>
                                ) : answerHistory[question._id] && answerHistory[question._id][school._id] === false ? (
                                  <span className="text-red-500 font-bold">✗</span>
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
            </div>
          </AdminBox>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-xl font-semibold mb-4">
              {editingQuestionId ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Question</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="3"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter the question"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Answer</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="2"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Enter the answer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setShowAddQuestionModal(false);
                  setEditingQuestionId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-800 text-white rounded"
                onClick={handleAddQuestion}
              >
                {editingQuestionId ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game History Modal (could be shown when needed) */}
      {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Game History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b">Question</th>
                  <th className="py-3 px-4 border-b">Answer</th>
                  <th className="py-3 px-4 border-b">Time (sec)</th>
                  <th className="py-3 px-4 border-b">Schools Correct</th>
                </tr>
              </thead>
              <tbody>
                {questions.slice(0, 5).map((q, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 border-b">{q.question}</td>
                    <td className="py-3 px-4 border-b">{q.answer}</td>
                    <td className="py-3 px-4 border-b text-center">60</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex flex-wrap gap-1">
                        {schools.slice(0, Math.floor(Math.random() * schools.length + 1)).map(s => (
                          <span key={s._id} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {s.nameInShort}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      </div> */}
    </AdminLayout>
  );
}