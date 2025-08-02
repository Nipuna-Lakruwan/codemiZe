import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaPlus, FaEye, FaClock, FaPlayCircle, FaStopCircle, FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaEdit, FaTrash, FaSearch, FaFilter, FaSave, FaSync } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import { SocketContext } from '../../../context/SocketContext';

export default function AdminBattleBreakers() {
  const socket = useContext(SocketContext)
  const [activeTab, setActiveTab] = useState('Upload');
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [schools, setSchools] = useState([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [schoolAnswers, setSchoolAnswers] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctSchool, setCorrectSchool] = useState(null);
  const [allocatedTime, setAllocatedTime] = useState(30);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [answerHistory, setAnswerHistory] = useState({});
  const [showQuestionText, setShowQuestionText] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const tableRef = useRef(null);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axiosInstance.get(API_PATHS.BATTLE_BREAKERS.GET_QUESTIONS);
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    };
    fetchQuestions();
  }, []);

  const loadExistingAttempts = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.BATTLE_BREAKERS.GET_ANSWERS);
      const existingAnswers = response.data;
      
      // Transform the backend data into the frontend answerHistory format
      const transformedAnswerHistory = {};
      
      existingAnswers.forEach(answerDoc => {
        // Skip if questionId is null or undefined
        if (!answerDoc.questionId || !answerDoc.questionId._id) {
          console.warn('Skipping answer document with null/undefined questionId:', answerDoc);
          return;
        }
        
        const questionId = answerDoc.questionId._id;
        transformedAnswerHistory[questionId] = {};
        
        let correctSchoolId = null;
        let totalAttempts = 0;
        
        // Process each response
        answerDoc.responses.forEach(response => {
          // Skip if userId is null or undefined
          if (!response.userId || !response.userId._id) {
            console.warn('Skipping response with null/undefined userId:', response);
            return;
          }
          
          const schoolId = response.userId._id;
          const attempt = response.attempt;
          const isCorrect = response.status === "Correct";
          
          // Track the specific attempt
          transformedAnswerHistory[questionId][`${schoolId}_attempt_${attempt}`] = isCorrect;
          
          // Set general school status (for backward compatibility)
          transformedAnswerHistory[questionId][schoolId] = isCorrect;
          
          // Track correct school
          if (isCorrect) {
            correctSchoolId = schoolId;
          }
          
          // Track total attempts
          totalAttempts = Math.max(totalAttempts, attempt);
        });
        
        // Set metadata
        if (correctSchoolId) {
          transformedAnswerHistory[questionId].correctSchool = correctSchoolId;
        }
        transformedAnswerHistory[questionId].totalAttempts = totalAttempts;
      });
      
      setAnswerHistory(transformedAnswerHistory);
      
      // If we're on a question that has existing answers, load them
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && transformedAnswerHistory[currentQuestionId]) {
        const savedAnswers = transformedAnswerHistory[currentQuestionId];
        
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
    } catch (error) {
      console.error("Error fetching existing attempts:", error);
      // Don't show alert for this error as it's not critical
    }
  };

  // Fetch existing answers/attempts
  useEffect(() => {
    // Only fetch if we have questions and schools loaded
    if (questions.length > 0 && schools.length > 0) {
      loadExistingAttempts();
    }
  }, [questions, schools, currentQuestionIndex]);

  // Fetch Schools
  useEffect(() => {
    const fetchSchools = async () => {
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS);
      setSchools(response.data.schools);
    };
    fetchSchools();
  }, []);

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

        // Don't load historical answers into current state - only load them when question becomes active
        // setSchoolAnswers(schoolAnswersFromHistory);
        setCorrectSchool(savedAnswers.correctSchool || null);
        setTotalAttempts(savedAnswers.totalAttempts || 0);
      } else {
        // Clear current state when switching to a question without history
        setSchoolAnswers({});
        setCorrectSchool(null);
        setTotalAttempts(0);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("csv", file);

    const response = await axiosInstance.post(API_PATHS.BATTLE_BREAKERS.UPLOAD_CSV, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const newQuestions = response.data.data;

    setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
    alert('Questions uploaded successfully!');
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim() || !answerText.trim()) {
      alert('Question and answer are required!');
      return;
    }

    if (editingQuestionId) {
      try {
        await axiosInstance.put(API_PATHS.BATTLE_BREAKERS.EDIT_QUESTION(editingQuestionId), {
          question: questionText,
          answer: answerText
        });
        setQuestions(prevQuestions =>
          prevQuestions.map(q =>
            q._id === editingQuestionId
              ? { ...q, question: questionText, answer: answerText }
              : q
          )
        );
      } catch (error) {
        console.error("Error editing question:", error);
      }

      setEditingQuestionId(null);
    } else {
      // Add new question
      const newQuestion = {
        question: questionText,
        answer: answerText
      };
      
      try {
        const response = await axiosInstance.post(API_PATHS.BATTLE_BREAKERS.ADD_QUESTION, newQuestion);
        setQuestions(prevQuestions => [...prevQuestions, response.data]);
      } catch (error) {
        console.error("Error adding question:", error);
      }
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
      axiosInstance.delete(API_PATHS.BATTLE_BREAKERS.DELETE_QUESTION(questionId));
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));

      // If we're deleting the current question, adjust currentQuestionIndex
      if (questions[currentQuestionIndex]?._id === questionId) {
        if (currentQuestionIndex >= questions.length - 1) {
          setCurrentQuestionIndex(Math.max(0, questions.length - 2));
        }
      }
    }
  };

  // Helper function to find the first incomplete question
  const findFirstIncompleteQuestion = () => {
    for (let i = 0; i < questions.length; i++) {
      const questionId = questions[i]._id;
      if (!isQuestionCompleted(questionId)) {
        return i;
      }
    }
    return 0; // If all questions are completed, return the first one
  };

  // Effect to set current question to first incomplete question when questions or answer history changes
  // This is now commented out to allow free navigation between all questions
  // useEffect(() => {
  //   if (questions.length > 0 && Object.keys(answerHistory).length > 0 && !isQuestionActive) {
  //     const firstIncompleteIndex = findFirstIncompleteQuestion();
  //     if (firstIncompleteIndex !== currentQuestionIndex) {
  //       setCurrentQuestionIndex(firstIncompleteIndex);
  //     }
  //   }
  // }, [questions, answerHistory, isQuestionActive]);

  // Helper function to check if a question is completed
  const isQuestionCompleted = (questionId) => {
    const history = answerHistory[questionId];
    if (!history) return false;

    // Check if there's a correct answer
    if (history.correctSchool) return true;

    // Count incorrect answers (only count actual school responses, not metadata)
    const incorrectCount = Object.entries(history)
      .filter(([key, value]) => 
        !key.includes('_attempt_') && 
        key !== 'correctSchool' && 
        key !== 'totalAttempts' && 
        key !== 'timeUsed' && 
        value === false &&
        schools.some(school => school._id === key) // Only count if it's actually a school ID
      ).length;

    // Question is completed if there are 2 incorrect answers
    return incorrectCount >= 2;
  };

  const startQuestion = () => {
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionId = currentQuestion?._id;
    
    // Check if current question is already completed
    if (currentQuestionId && isQuestionCompleted(currentQuestionId)) {
      alert('This question is already completed. Please select an incomplete question.');
      return;
    }

    // Emit the active question via socket
    const time = Date.now();
    if (currentQuestion) {
      socket.emit('battleBreakers-startQuestion', {
        _id: currentQuestion._id,
        questionNo: currentQuestionIndex + 1,
        question: currentQuestion.question,
        startTime: time,
        allocatedTime: allocatedTime
      });
    }

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

    // Only save to answer history if there are actual submissions
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId || Object.keys(schoolAnswers).length === 0) return;

    // Prepare updated answer history with attempt tracking
    const updatedAnswerHistory = { ...answerHistory };
    if (!updatedAnswerHistory[currentQuestionId]) {
      updatedAnswerHistory[currentQuestionId] = {};
    }
    
    // Add general answers and metadata
    updatedAnswerHistory[currentQuestionId] = {
      ...updatedAnswerHistory[currentQuestionId],
      ...schoolAnswers,
      correctSchool,
      totalAttempts,
      timeUsed: allocatedTime - timeRemaining
    };
    
    // Make sure all tracked attempts are saved
    Object.entries(wrongAttempts).forEach(([schoolId, attempts]) => {
      for (let i = 1; i <= attempts; i++) {
        updatedAnswerHistory[currentQuestionId][`${schoolId}_attempt_${i}`] = false;
      }
    });
    
    // If there's a correct answer, add it as a correct attempt
    if (correctSchool) {
      const attemptNum = (wrongAttempts[correctSchool] || 0) + 1;
      updatedAnswerHistory[currentQuestionId][`${correctSchool}_attempt_${attemptNum}`] = true;
    }
    
    setAnswerHistory(updatedAnswerHistory);
  };

  const goToNextIncompleteQuestion = () => {
    for (let i = currentQuestionIndex + 1; i < questions.length; i++) {
      if (!isQuestionCompleted(questions[i]._id)) {
        setCurrentQuestionIndex(i);
        return;
      }
    }
    // If no incomplete question found after current, check from beginning
    for (let i = 0; i < currentQuestionIndex; i++) {
      if (!isQuestionCompleted(questions[i]._id)) {
        setCurrentQuestionIndex(i);
        return;
      }
    }
    // If all questions are completed, stay on current
    alert('All questions have been completed!');
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current question state to history before moving (only if there are submissions)
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && Object.keys(schoolAnswers).length > 0) {
        // Prepare updated answer history with attempt tracking
        const updatedAnswerHistory = { ...answerHistory };
        if (!updatedAnswerHistory[currentQuestionId]) {
          updatedAnswerHistory[currentQuestionId] = {};
        }
        
        // Add general answers and metadata
        updatedAnswerHistory[currentQuestionId] = {
          ...updatedAnswerHistory[currentQuestionId],
          ...schoolAnswers,
          correctSchool,
          totalAttempts,
          timeUsed: allocatedTime - timeRemaining
        };
        
        // Make sure all tracked attempts are saved
        Object.entries(wrongAttempts).forEach(([schoolId, attempts]) => {
          for (let i = 1; i <= attempts; i++) {
            updatedAnswerHistory[currentQuestionId][`${schoolId}_attempt_${i}`] = false;
          }
        });
        
        // If there's a correct answer, add it as a correct attempt
        if (correctSchool) {
          const attemptNum = (wrongAttempts[correctSchool] || 0) + 1;
          updatedAnswerHistory[currentQuestionId][`${correctSchool}_attempt_${attemptNum}`] = true;
        }
        
        setAnswerHistory(updatedAnswerHistory);
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
      // Save current question state to history before moving (only if there are submissions)
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (currentQuestionId && Object.keys(schoolAnswers).length > 0) {
        // Prepare updated answer history with attempt tracking
        const updatedAnswerHistory = { ...answerHistory };
        if (!updatedAnswerHistory[currentQuestionId]) {
          updatedAnswerHistory[currentQuestionId] = {};
        }
        
        // Add general answers and metadata
        updatedAnswerHistory[currentQuestionId] = {
          ...updatedAnswerHistory[currentQuestionId],
          ...schoolAnswers,
          correctSchool,
          totalAttempts,
          timeUsed: allocatedTime - timeRemaining
        };
        
        // Make sure all tracked attempts are saved
        Object.entries(wrongAttempts).forEach(([schoolId, attempts]) => {
          for (let i = 1; i <= attempts; i++) {
            updatedAnswerHistory[currentQuestionId][`${schoolId}_attempt_${i}`] = false;
          }
        });
        
        // If there's a correct answer, add it as a correct attempt
        if (correctSchool) {
          const attemptNum = (wrongAttempts[correctSchool] || 0) + 1;
          updatedAnswerHistory[currentQuestionId][`${correctSchool}_attempt_${attemptNum}`] = true;
        }
        
        setAnswerHistory(updatedAnswerHistory);
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

  const handleMarkAnswer = async (schoolId, isCorrect) => {
    // Only allow marking if no correct answer yet and less than 2 wrongs
    if (correctSchool !== null) return;

    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;

    // Count current wrong attempts for this question (total across all schools)
    const wrongCount = Object.values(schoolAnswers).filter(v => v === false).length;

    // Don't allow if this school has already answered or if we have 2 wrong answers already
    if (schoolAnswers[schoolId] !== undefined || (!isCorrect && wrongCount >= 2)) {
      return;
    }

    // Calculate the global attempt number for this question
    // Count how many schools have already answered
    const totalAnswers = Object.keys(schoolAnswers).length;
    const currentAttemptNum = totalAnswers + 1;

    // Prepare submission data for the API
    const submissionData = {
      questionId: currentQuestionId,
      submissions: [{
        userId: schoolId,
        attempt: currentAttemptNum,
        status: isCorrect ? "Correct" : "Incorrect"
      }]
    };

    try {
      // Call the submitAnswers API endpoint
      await axiosInstance.post(API_PATHS.BATTLE_BREAKERS.SUBMIT_ANSWERS, submissionData);
      
      if (isCorrect) {
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
              correctSchool: schoolId,
              [`${schoolId}_attempt_${currentAttemptNum}`]: true, // Track specific attempt
              totalAttempts: currentAttemptNum, // Track total attempts for this question
              timeUsed: allocatedTime - timeRemaining
            }
          };
        });
      } else {
        setSchoolAnswers(prev => ({
          ...prev,
          [schoolId]: false
        }));

        // Save to answer history
        setAnswerHistory(prev => {
          const questionAnswers = prev[currentQuestionId] || {};
          return {
            ...prev,
            [currentQuestionId]: {
              ...questionAnswers,
              [schoolId]: false, // Keep the general status for backward compatibility
              [`${schoolId}_attempt_${currentAttemptNum}`]: false, // Track specific attempt
              totalAttempts: currentAttemptNum // Track total attempts for this question
            }
          };
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
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

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all questions?')) {
      await axiosInstance.delete(API_PATHS.BATTLE_BREAKERS.DELETE_ALL_QUESTIONS);
      setQuestions([]);
    }
  }

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
                      onClick={handleDeleteAll}
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
                    className={`px-4 py-2 rounded flex items-center gap-1 ${
                      questions.length === 0 || (questions[currentQuestionIndex] && isQuestionCompleted(questions[currentQuestionIndex]._id))
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={questions.length === 0 || (questions[currentQuestionIndex] && isQuestionCompleted(questions[currentQuestionIndex]._id))}
                    title={questions[currentQuestionIndex] && isQuestionCompleted(questions[currentQuestionIndex]._id) ? 'This question is already completed' : ''}
                  >
                    <FaPlayCircle />
                    {questions[currentQuestionIndex] && isQuestionCompleted(questions[currentQuestionIndex]._id) ? 'Completed' : 'Start'}
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
                <div className="text-sm text-gray-600"></div>
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
                        className={`${
                          qIndex === currentQuestionIndex ? "bg-purple-50" : 
                          isQuestionCompleted(question._id) ? "bg-green-50" :
                          qIndex % 2 === 0 ? "bg-gray-50" : ""
                        }`}
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
                          {isQuestionCompleted(question._id) && qIndex !== currentQuestionIndex && (
                            <div className="text-xs font-semibold text-green-600">Completed</div>
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
                                    // Check if this school has already answered
                                    const schoolHasAnswered = schoolAnswers[school._id] !== undefined;
                                    
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
                                    
                                    // If this school has already answered, show result
                                    if (schoolHasAnswered) {
                                      if (schoolAnswers[school._id] === true) {
                                        return <span className="text-green-500 font-bold text-lg">✓</span>;
                                      } else {
                                        return <span className="text-red-500 font-bold text-lg">✗</span>;
                                      }
                                    }
                                    
                                    // Normal state with both buttons available
                                    return (
                                      <>
                                        <button
                                          className="p-1 rounded bg-gray-200 hover:bg-green-200"
                                          onClick={() => handleMarkAnswer(school._id, true)}
                                        >
                                          <FaCheck size={12} />
                                        </button>
                                        <button
                                          className="p-1 rounded bg-gray-200 hover:bg-red-200"
                                          onClick={() => handleMarkAnswer(school._id, false)}
                                        >
                                          <FaTimes size={12} />
                                        </button>
                                      </>
                                    );
                                  })()
                                ) : (
                                  /* Non-active current question - Show result icons from history */
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