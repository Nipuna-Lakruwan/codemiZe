import React, { useEffect, useState } from 'react';
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
  const [questions, setQuestions] = useState([
    { id: 1, question: 'What is the capital of Sri Lanka?', options: ['Kandy', 'Galle', 'Jaffna'], correct: 'Colombo' },
    { id: 2, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 'Stack' },
    { id: 3, question: 'Which programming language is known as the "mother of all languages"?', options: ['C', 'Java', 'Python', 'COBOL'], correct: 'C' },
    { id: 4, question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 'Cascading Style Sheets' },
    { id: 5, question: 'Which HTML tag is used for creating an unordered list?', options: ['<ol>', '<li>', '<ul>', '<list>'], correct: '<ul>' },
  ]);

  useEffect(() => {
    const getQnA = async () => {
      const response = await axiosInstance.get(API_PATHS.QUIZ_HUNTERS.GET_Q_WITH_A);
      setQuestions(response.data);
    }
    getQnA();
  },[]);

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
      // Here you would handle the CSV upload to the backend
      console.log('Uploading file:', selectedFile);

      // Simulating new questions added - create 10 sample questions
      const newQuestions = Array.from({ length: 10 }, (_, i) => {
        const id = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + i + 1 : i + 1;
        return {
          id,
          question: `Sample Question ${id} from CSV`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 'Option A'
        };
      });

      setQuestions([...questions, ...newQuestions]);
      showAlert('CSV file uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleAddQuestionClick = () => {
    setModalMode('add');
    setCurrentQuestion({
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
      question: '',
      options: ['', '', '', ''],
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

    if (modalMode === 'add') {
      // Add new question
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

  const handleConfirmTime = () => {
    const timeToUse = allocatedTime === 'custom' ? parseInt(customTime) : allocatedTime;
    if (allocatedTime === 'custom' && (!customTime || isNaN(parseInt(customTime)))) {
      showAlert('Please enter a valid time in minutes', 'Time Allocation Error', 'error');
      return;
    }
    showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
  };

  return (
    <AdminLayout>
      {/* Top row with three rectangles */}
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
        <div className="flex flex-col gap-5 mt-6 max-h-[600px] overflow-y-auto custom-scrollbar px-2">
          {questions.length > 0 ? (
            questions.map((q, index) => (
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
