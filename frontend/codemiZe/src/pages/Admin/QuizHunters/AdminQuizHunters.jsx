import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaPlus, FaTrashAlt, FaFileAlt } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import QuestionItem from '../../../components/Admin/QuizComponents/QuestionItem';
import QuestionModal from '../../../components/Admin/QuizComponents/QuestionModal';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

export default function AdminQuizHunters() {
  // Questions state
  const [selectedFile, setSelectedFile] = useState(null);
  const [allocatedTime, setAllocatedTime] = useState(30); // Default 30 minutes
  const [customTime, setCustomTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all'); // 'all', 'easy', 'medium', 'hard'

  // Fetch questions from API on component mount
  useEffect(() => {
    // Uncomment this code when API integration is ready
    // const fetchQuestions = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await axiosInstance.get('/api/quizhunters/QnA');
    //     if (response.data && response.data.questions) {
    //       // Transform backend format to frontend format
    //       const formattedQuestions = response.data.questions.map(q => ({
    //         id: q._id,
    //         question: q.question,
    //         options: [q.answer, q.option1, q.option2, q.option3],
    //         correct: q.answer
    //       }));
    //       setQuestions(formattedQuestions);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching questions:', error);
    //     showAlert('Failed to load questions', 'Error', 'error');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchQuestions();
  }, []);
  // Mock questions that match the backend structure with added difficulty property
  const [questions, setQuestions] = useState([
    { id: '61f8b1e5c7d1f52e4c8b4567', question: 'What is the capital of Sri Lanka?', options: ['Colombo', 'Kandy', 'Galle', 'Jaffna'], correct: 'Colombo', difficulty: 'easy' },
    { id: '61f8b1e5c7d1f52e4c8b4568', question: 'Which data structure uses LIFO?', options: ['Stack', 'Queue', 'Linked List', 'Tree'], correct: 'Stack', difficulty: 'medium' },
    { id: '61f8b1e5c7d1f52e4c8b4569', question: 'Which programming language is known as the "mother of all languages"?', options: ['C', 'Java', 'Python', 'COBOL'], correct: 'C', difficulty: 'medium' },
    { id: '61f8b1e5c7d1f52e4c8b456a', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 'Cascading Style Sheets', difficulty: 'easy' },
    { id: '61f8b1e5c7d1f52e4c8b456b', question: 'Which HTML tag is used for creating an unordered list?', options: ['<ul>', '<ol>', '<li>', '<list>'], correct: '<ul>', difficulty: 'hard' },
  ]);

  useEffect(() => {
    const getQnA = async () => {
      const response = await axiosInstance.get(API_PATHS.QUIZ_HUNTERS.GET_Q_WITH_A);
      setQuestions(response.data);
    }
    getQnA();
  }, []);

  // Modal states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: '',
    options: ['', '', '', ''],
    correct: ''
  });

  // Confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', or 'error'
  });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Here you would handle the CSV upload to the backend using formData
      console.log('Uploading file:', selectedFile);

      // In a real implementation, you would use:
      // const formData = new FormData();
      // formData.append('csv', selectedFile);
      // axios.post('/api/quizhunters/uploadCSV', formData)

      // Simulating new questions added - create 5 sample questions that match backend structure
      const newQuestions = Array.from({ length: 5 }, (_, i) => {
        // Generate MongoDB-style ObjectId
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        const id = timestamp + machineId + processId + counter;

        return {
          id,
          question: `Sample Question ${questions.length + i + 1} from CSV`,
          // In backend: first option is the correct answer, followed by 3 wrong options
          options: [
            `Correct Answer for Q${questions.length + i + 1}`,
            `Wrong Option 1 for Q${questions.length + i + 1}`,
            `Wrong Option 2 for Q${questions.length + i + 1}`,
            `Wrong Option 3 for Q${questions.length + i + 1}`
          ],
          correct: `Correct Answer for Q${questions.length + i + 1}`
        };
      });

      setQuestions([...questions, ...newQuestions]);
      setSelectedFile(null); // Reset file input after upload
      showAlert('CSV file uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleAddQuestionClick = () => {
    setModalMode('add');

    // Generate a temporary MongoDB-style ObjectId for new questions
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    const id = timestamp + machineId + processId + counter;

    setCurrentQuestion({
      id: id,
      question: '',
      options: ['', '', '', ''], // First option should be the correct answer in the backend
      correct: ''
    });
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setModalMode('edit');
    setCurrentQuestion({ ...question });
    setShowQuestionModal(true);
  };

  const handleCloseModal = () => {
    setShowQuestionModal(false);
  };

  const handleSaveQuestion = () => {
    // Validate
    if (!currentQuestion.question.trim()) {
      showAlert('Question text cannot be empty', 'Validation Error', 'error');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.trim())) {
      showAlert('All options must be filled', 'Validation Error', 'error');
      return;
    }

    if (!currentQuestion.correct) {
      showAlert('Please select a correct answer', 'Validation Error', 'error');
      return;
    }

    // Make sure the correct answer is included in the options
    if (!currentQuestion.options.includes(currentQuestion.correct)) {
      showAlert('The correct answer must be one of the options', 'Validation Error', 'error');
      return;
    }

    if (modalMode === 'add') {
      // Add new question
      // In a real implementation, you would:
      // 1. Prepare the data for backend format
      // 2. Submit to API
      // const questionData = {
      //   question: currentQuestion.question,
      //   answer: currentQuestion.correct,
      //   option1: currentQuestion.options.filter(o => o !== currentQuestion.correct)[0],
      //   option2: currentQuestion.options.filter(o => o !== currentQuestion.correct)[1],
      //   option3: currentQuestion.options.filter(o => o !== currentQuestion.correct)[2]
      // };
      // axios.post('/api/quizhunters/addQuestion', questionData)
      const addQuestion = async () => {
        try {
          await axiosInstance.post(API_PATHS.QUIZ_HUNTERS.ADD_QUESTION, currentQuestion);
        } catch (error) {
          console.error('Error adding question:', error);
        }
      };

      addQuestion();
      setQuestions([...questions, currentQuestion]);
      showAlert('Question added successfully', 'Success', 'success');
    } else {
      // Update existing question
      // In a real implementation, you would:
      // const questionData = {
      //   question: currentQuestion.question,
      //   answer: currentQuestion.correct,
      //   option1: currentQuestion.options.filter(o => o !== currentQuestion.correct)[0],
      //   option2: currentQuestion.options.filter(o => o !== currentQuestion.correct)[1],
      //   option3: currentQuestion.options.filter(o => o !== currentQuestion.correct)[2]
      // };
      // axios.put(`/api/quizhunters/editQuestion/${currentQuestion.id}`, questionData)

      const updatedQuestions = questions.map(q =>
        q.id === currentQuestion.id ? currentQuestion : q
      );
      setQuestions(updatedQuestions);
      showAlert('Question updated successfully', 'Success', 'success');
    }
    setShowQuestionModal(false);
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (option) => {
    setCurrentQuestion({ ...currentQuestion, correct: option });
  };

  const handleDeleteAllQuestions = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAllQuestions = () => {
    // In a real implementation, you would:
    // axios.delete('/api/quizhunters/deleteAllQuestions')
    //   .then(() => {
    //     setQuestions([]);
    //     showAlert('All questions have been deleted', 'Delete Successful', 'success');
    //   })
    //   .catch(error => {
    //     console.error('Error deleting all questions:', error);
    //     showAlert('Failed to delete all questions', 'Error', 'error');
    //   });

    setQuestions([]);
    setShowDeleteAllModal(false);
    showAlert('All questions have been deleted', 'Delete Successful', 'success');
  };

  const handleDeleteQuestion = (id) => {
    setQuestionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuestion = () => {
    if (questionToDelete !== null) {
      // In a real implementation, you would:
      // axios.delete(`/api/quizhunters/deleteQuestion/${questionToDelete}`)

      const updatedQuestions = questions.filter(q => q.id !== questionToDelete);
      setQuestions(updatedQuestions);
      setQuestionToDelete(null);
      setShowDeleteModal(false);
      showAlert('Question has been deleted', 'Delete Successful', 'success');
    }
  };

  // Helper function for showing alerts
  const showAlert = (message, title = 'Alert', type = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertModal({
      ...alertModal,
      isOpen: false
    });
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setAllocatedTime('custom');
    } else {
      setAllocatedTime(parseInt(value));
      setCustomTime("");
    }
  };

  const handleCustomTimeChange = (e) => {
    setCustomTime(e.target.value);
  };

  // Function to download a CSV template for users
  const downloadTemplateCSV = () => {
    const csvContent = "question,correctAnswer,wrong1,wrong2,wrong3\n" +
      "What is the capital of France?,Paris,London,Berlin,Madrid\n" +
      "Which planet is known as the Red Planet?,Mars,Venus,Jupiter,Mercury";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_hunters_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export current questions to CSV
  const exportQuestionsToCSV = () => {
    if (questions.length === 0) {
      showAlert('No questions to export', 'Export Failed', 'error');
      return;
    }

    let csvContent = "question,correctAnswer,wrong1,wrong2,wrong3\n";

    questions.forEach(q => {
      // Get wrong options (all options except the correct answer)
      const wrongOptions = q.options.filter(opt => opt !== q.correct);
      // Make sure we have exactly 3 wrong options
      while (wrongOptions.length < 3) {
        wrongOptions.push(''); // Add empty strings if needed
      }

      // Escape any commas in the text fields
      const escapedQuestion = q.question.replace(/,/g, '","');
      const escapedCorrect = q.correct.replace(/,/g, '","');
      const escapedWrong1 = wrongOptions[0].replace(/,/g, '","');
      const escapedWrong2 = wrongOptions[1].replace(/,/g, '","');
      const escapedWrong3 = wrongOptions[2].replace(/,/g, '","');

      csvContent += `"${escapedQuestion}","${escapedCorrect}","${escapedWrong1}","${escapedWrong2}","${escapedWrong3}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_hunters_questions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert(`${questions.length} questions exported to CSV`, 'Export Successful', 'success');
  };

  const handleConfirmTime = () => {
    const timeToUse = allocatedTime === 'custom' ? parseInt(customTime) : allocatedTime;
    if (allocatedTime === 'custom' && (!customTime || isNaN(parseInt(customTime)))) {
      showAlert('Please enter a valid time in minutes', 'Time Allocation Error', 'error');
      return;
    }

    // In a real implementation, you would:
    // axios.post('/api/quizhunters/setTime', { time: timeToUse })
    //   .then(() => {
    //     showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
    //   })
    //   .catch(error => {
    //     console.error('Error setting time:', error);
    //     showAlert('Failed to set time', 'Error', 'error');
    //   });

    showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
  };

  return (
    <AdminLayout>
      {/* Top row with three rectangles */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Quiz Management Dashboard</h2>
        <p className="text-gray-600 mb-0">
          Manage Quiz Hunters questions, import from CSV, allocate time, and configure game settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 mb-8">
        {/* First rectangle - Upload Questions */}
        <AdminBox title="Upload Questions" width="flex-1 min-w-[300px]" minHeight="200px">
          <div className="flex flex-col space-y-6 mt-7">
            <div className="flex items-center gap-4">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter']">Upload CSV File</div>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 w-full cursor-pointer"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-purple-800 rounded-[3px] flex items-center justify-center text-white"
                >
                  <FaUpload size={16} />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              {selectedFile && (
                <div className="w-full text-sm text-gray-600 mb-2">
                  Selected: {selectedFile.name}
                </div>
              )}

              {!selectedFile && (
                <div className="w-full text-xs text-gray-500 mb-1">
                  CSV format: question, correctAnswer, wrong1, wrong2, wrong3
                  <button
                    onClick={() => downloadTemplateCSV()}
                    className="ml-2 text-sky-600 hover:text-sky-800 underline"
                  >
                    Download template
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFileUpload}
                className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
                disabled={!selectedFile}
              >
                <FaFileAlt size={14} />
                Upload CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddQuestionClick}
                className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
              >
                <FaPlus size={14} />
                Add Question
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteAllQuestions}
                className="flex items-center gap-2 h-10 bg-red-500 rounded-[3px] text-white px-4 text-sm font-medium"
                disabled={questions.length === 0}
              >
                <FaTrashAlt size={14} />
                Delete All Questions
              </motion.button>
            </div>
          </div>
        </AdminBox>

        {/* Second rectangle - Total Questions */}
        <AdminBox title="Total Questions" width="w-64" minHeight="200px">
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="text-purple-800 text-5xl font-semibold font-['Inter']">{questions.length}</div>
            <div className="text-sky-600 text-xl font-semibold font-['Oxanium'] mt-2">Questions</div>
          </div>
        </AdminBox>

        {/* Third rectangle - Allocate Time */}
        <AdminBox title="Allocate Time" width="w-48" minHeight="200px">
          <div className="flex flex-col gap-4 items-center mt-6">
            <div className="w-32 h-10 bg-zinc-200 rounded-md flex items-center justify-center">
              <select
                value={allocatedTime}
                onChange={handleTimeChange}
                className="w-full h-full px-2 bg-transparent border-none rounded-md focus:outline-none text-sm"
              >
                {[15, 30, 45, 60, 90, 120].map((time) => (
                  <option key={time} value={time}>{time} min</option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>

            {allocatedTime === 'custom' && (
              <input
                type="number"
                value={customTime}
                onChange={handleCustomTimeChange}
                placeholder="Minutes"
                className="w-32 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-800 text-sm"
                min="1"
              />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirmTime}
              className="w-32 h-10 bg-sky-600 rounded-[3px] text-white text-sm font-medium"
            >
              Confirm
            </motion.button>
          </div>
        </AdminBox>
      </div>

      {/* Questions List */}
      <AdminBox title="Questions" minHeight="auto">
        <div className="flex flex-wrap items-center justify-between mb-4 mt-2 gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-shrink-0 space-x-2">
            <select
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              onChange={(e) => {
                const action = e.target.value;
                if (action === 'delete-all') {
                  handleDeleteAllQuestions();
                } else if (action === 'export-csv') {
                  exportQuestionsToCSV();
                }
                // Reset select after action
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="" disabled>Bulk Actions</option>
              <option value="delete-all">Delete All Questions</option>
              <option value="export-csv">Export to CSV</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5 max-h-[600px] overflow-y-auto custom-scrollbar px-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-800"></div>
            </div>
          ) : questions.length > 0 ? (
            // Filter questions based on search term
            questions
              .filter(q =>
                (searchTerm === '' ||
                  q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                (filterDifficulty === 'all' || q.difficulty === filterDifficulty)
              )
              .map((q, index) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  number={index + 1}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              )).length > 0 ? (
              questions
                .filter(q =>
                  (searchTerm === '' ||
                    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                  (filterDifficulty === 'all' || q.difficulty === filterDifficulty)
                )
                .map((q, index) => (
                  <QuestionItem
                    key={q.id}
                    question={q}
                    number={index + 1}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                {searchTerm && filterDifficulty !== 'all' ?
                  `No ${filterDifficulty} questions match your search for "${searchTerm}"` :
                  searchTerm ?
                    `No questions match your search for "${searchTerm}"` :
                    `No ${filterDifficulty} difficulty questions found`
                }
                <div className="flex justify-center gap-3 mt-2">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      Clear search
                    </button>
                  )}
                  {filterDifficulty !== 'all' && (
                    <button
                      onClick={() => setFilterDifficulty('all')}
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      Show all difficulties
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              No questions available. Upload a CSV or add questions manually.
            </div>
          )}
        </div>
      </AdminBox>

      {/* Question Modal - Using our component */}
      <QuestionModal
        isOpen={showQuestionModal}
        onClose={handleCloseModal}
        onSave={handleSaveQuestion}
        modalMode={modalMode}
        currentQuestion={currentQuestion}
        handleQuestionChange={handleQuestionChange}
        handleOptionChange={handleOptionChange}
        handleCorrectAnswerChange={handleCorrectAnswerChange}
        instructionText="Create a clear question with 4 unique options. Select one as the correct answer."
      />

      {/* Delete Question Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      {/* Delete All Questions Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={confirmDeleteAllQuestions}
        title="Delete All Questions"
        message="Are you sure you want to delete ALL questions? This action cannot be undone and will remove all quiz content."
        confirmText="Delete All"
        type="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        buttonText="Okay"
      />

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #5b21b6;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4c1d95;
        }
      `}</style>
    </AdminLayout>
  );
}
