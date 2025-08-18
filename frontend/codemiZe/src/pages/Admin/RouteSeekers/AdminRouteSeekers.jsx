import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTrashAlt, FaDownload, FaEye } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
{/* Alert and Confirmation modals are now imported via ModalComponents */ }
import { TeamQuestionsView, QuestionersResponsesSection, NetworkDesignSection, TeamsSection, ModalComponents } from '../../../components/Admin/RouteComponents';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

export default function AdminRouteSeekers() {
  // States for resources
  const [selectedFile, setSelectedFile] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0); // Renamed from questions to avoid conflict
  const [resources, setResources] = useState(0); // Will be fetched
  const [responses, setResponses] = useState(0); // Will be derived from answers
  const [allocatedTime, setAllocatedTime] = useState(30); // Minutes (default)
  const [customTime, setCustomTime] = useState("");
  const [activeTab, setActiveTab] = useState('Questioners');

  // States for team questions view
  const [viewingTeam, setViewingTeam] = useState(null);
  const [teamQuestions, setTeamQuestions] = useState([]);
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);

  // Data states
  const [schools, setSchools] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [showDeleteQuestionsModal, setShowDeleteQuestionsModal] = useState(false);
  const [showDeleteResourcesModal, setShowDeleteResourcesModal] = useState(false);
  const [showDeleteNetworkResourceModal, setShowDeleteNetworkResourceModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [schoolsRes, questionsRes, answersRes, timeRes, resourceFilesRes, networkDesignsRes] = await Promise.all([
          axiosInstance.get('/api/v1/admin/schools'),
          axiosInstance.get('/api/v1/questions/route-seekers'),
          axiosInstance.get('/api/v1/route-seekers/all-student-answers'),
          axiosInstance.get(API_PATHS.ROUTE_SEEKERS.GET_TIME),
          axiosInstance.get('/api/v1/questions/route-seekers/resource-files'),
          axiosInstance.get('/api/v1/route-seekers/network-designs')
        ]);

        const schoolsData = schoolsRes.data.schools;
        const answersData = answersRes.data;

        const schoolsWithSubmissions = schoolsData.map(school => {
          const submission = answersData.find(answer => (answer.userId?._id || answer.userId) === school._id);
          return { ...school, submission: submission || null };
        });

        setSchools(schoolsWithSubmissions);
        setAllQuestions(questionsRes.data);
        setQuestionsCount(questionsRes.data.length);
        setResponses(answersRes.data.length);
        // timeRes.allocateTime is in seconds
        if (timeRes?.data?.allocateTime) {
          const fetchedMinutes = Math.round(timeRes.data.allocateTime / 60);
          const presetOptions = [15, 30, 45, 60, 90, 120];
          if (presetOptions.includes(fetchedMinutes)) {
            setAllocatedTime(fetchedMinutes);
            setCustomTime("");
          } else {
            setAllocatedTime('custom');
            setCustomTime(String(fetchedMinutes));
          }
        }
        setResources(resourceFilesRes.data.length + networkDesignsRes.data.length);

      } catch (error) {
        console.error("Error fetching data", error);
        showAlert('Failed to fetch data from the server.', 'Error', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // File handling functions
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleQuestionUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('csv', selectedFile);

      try {
        const response = await axiosInstance.post('/api/v1/questions/route-seekers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showAlert(`${response.data.length} questions uploaded successfully!`, 'Upload Successful', 'success');
        setQuestionsCount(prevCount => prevCount + response.data.length);
        setAllQuestions(prevQuestions => [...prevQuestions, ...response.data]);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading questions:', error);
        showAlert(error.response?.data?.message || 'Failed to upload questions.', 'Upload Error', 'error');
      }
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleResourceUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axiosInstance.post('/api/v1/questions/route-seekers/upload-resource', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showAlert('Resource file uploaded successfully!', 'Upload Successful', 'success');
        setResources(prev => prev + 1);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading resource file:', error);
        showAlert(error.response?.data?.message || 'Failed to upload resource file.', 'Upload Error', 'error');
      }
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleNetworkResourceUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axiosInstance.post('/api/v1/questions/route-seekers/network-design/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showAlert('Network design PDF uploaded successfully!', 'Upload Successful', 'success');
        setResources(prev => prev + 1);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading network design PDF:', error);
        showAlert(error.response?.data?.message || 'Failed to upload network design PDF.', 'Upload Error', 'error');
      }
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleResponseUpload = () => {
    if (selectedFile) {
      console.log('Uploading responses:', selectedFile);
      showAlert('Responses uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
      setResponses(responses + 3); // Simulate adding 3 new responses
      setSelectedFile(null);
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  // Delete handlers
  const handleDeleteQuestions = () => {
    setShowDeleteQuestionsModal(true);
  };

  const confirmDeleteQuestions = async () => {
    try {
      await axiosInstance.delete('/api/v1/questions/route-seekers');
      setQuestionsCount(0);
      setAllQuestions([]);
      showAlert('All questions and answers have been deleted successfully.', 'Delete Successful', 'success');
    } catch (error) {
      console.error("Error deleting questions", error);
      showAlert(error.response?.data?.message || 'Failed to delete questions.', 'Delete Error', 'error');
    } finally {
      setShowDeleteQuestionsModal(false);
    }
  };

  const handleDeleteResources = () => {
    setShowDeleteResourcesModal(true);
  };

  const confirmDeleteResources = async () => {
    try {
      await axiosInstance.delete('/api/v1/questions/route-seekers/resource-files');
      setResources(0);
      showAlert('All resources have been deleted', 'Delete Successful', 'success');
    } catch (error) {
      console.error("Error deleting resources", error);
      showAlert(error.response?.data?.message || 'Failed to delete resources.', 'Delete Error', 'error');
    } finally {
      setShowDeleteResourcesModal(false);
    }
  };

  const handleDeleteNetworkResources = () => {
    setShowDeleteNetworkResourceModal(true);
  };

  const confirmDeleteNetworkResources = () => {
    setResources(0);
    setShowDeleteNetworkResourceModal(false);
    showAlert('All network resources have been deleted', 'Delete Successful', 'success');
  };

  // View functions
  const handleViewQuestions = () => {
    showAlert('Viewing all questions', 'Questions View', 'info');
    // In a real implementation, this would open a modal to display `allQuestions`
  };

  const handleViewTeam = (team) => {
    const { submission } = team;

    if (!submission) {
      showAlert(`${team.name} has not submitted their answers yet.`, 'No Submission', 'info');
      setTeamQuestions([]);
      setViewingTeam(team);
      setActiveSubmissionId(null);
      return;
    }

    setActiveSubmissionId(submission._id);

    const populatedQuestions = allQuestions.map(q => {
      const studentAnswer = submission.Answers.find(a => a.questionId === q._id);
      return {
        id: q._id,
        questionId: q._id,
        question: q.question,
        correctAnswer: q.answer, // Correct answer from the question model
        answer: studentAnswer ? studentAnswer.answer : "Not Answered", // Student's submitted answer
        status: studentAnswer ? studentAnswer.status : null
      };
    });

    setTeamQuestions(populatedQuestions);
    setViewingTeam(team);
  };

  const handleBackToTeams = () => {
    setViewingTeam(null);
    setTeamQuestions([]);
    setActiveSubmissionId(null);
  };

  const updateQuestionStatus = async (questionIndex, newStatus) => {
    const question = teamQuestions[questionIndex];
    if (question.status === newStatus) return;

    const submissionId = activeSubmissionId;
    const questionId = question.questionId;

    const originalQuestions = teamQuestions;

    setTeamQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            status: newStatus,
        };
        return newQuestions;
    });

    try {
      await axiosInstance.patch(`/api/v1/route-seekers/answers/${submissionId}/questions/${questionId}`, { status: newStatus });
    } catch (error) {
      setTeamQuestions(originalQuestions);
      console.error("Failed to update mark", error);
      showAlert('Failed to update mark. Please try again.', 'Error', 'error');
    }
  };

  const handleMarkCorrect = (questionIndex) => {
    updateQuestionStatus(questionIndex, 'correct');
  };

  const handleMarkIncorrect = (questionIndex) => {
    updateQuestionStatus(questionIndex, 'incorrect');
  };

  const handleDownloadResources = () => {
    showAlert('Resources are being downloaded', 'Download Started', 'info');
    // Here you would implement the actual download logic
  };

  // Time allocation functions
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

  const handleConfirmTime = async () => {
    const timeToUse = allocatedTime === 'custom' ? parseInt(customTime) : allocatedTime;
    if (allocatedTime === 'custom' && (!customTime || isNaN(parseInt(customTime)))) {
      showAlert('Please enter a valid time in minutes', 'Time Allocation Error', 'error');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.ROUTE_SEEKERS.SET_TIME, { allocateTime: timeToUse * 60 });
      showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
    } catch (error) {
      console.error('Error setting time:', error);
      showAlert(error.response?.data?.message || 'Failed to set allocated time', 'Time Allocation Error', 'error');
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Main Admin Dashboard */}
      <>
        {/* Top row with main rectangles */}
        <div className="flex flex-wrap gap-6 mb-8">
          {/* First rectangle - Questionnaire */}
          <AdminBox width="flex-1 min-w-[300px]" minHeight="320px">
            <div className="flex flex-col space-y-4 mt-2">
              {/* Heading */}
              <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">Questionnaire</div>
              {/* Underline */}
              <img src="/under-line.png" alt="underline" className="w-full h-1" />

              {/* Upload Questions Section */}
              <div className="mt-3 mb-3">
                <div className="flex items-center">
                  <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload Questions</div>
                  <div className="ml-2">
                    <input
                      type="file"
                      id="questionFile"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".csv"
                    />
                    <label htmlFor="questionFile" className="cursor-pointer">
                      <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                        <FaUpload size={10} className="text-white" />
                      </div>
                    </label>
                  </div>
                  <motion.button
                    onClick={handleQuestionUpload}
                    disabled={!selectedFile}
                    className="ml-4 w-24 h-8 bg-purple-800 rounded-[3px] text-white text-xs flex items-center justify-center disabled:bg-gray-400"
                  >
                    Upload
                  </motion.button>
                </div>

                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteQuestions}
                    className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    disabled={questionsCount === 0}
                  >
                    Delete Questions
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewQuestions}
                    className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    disabled={questionsCount === 0}
                  >
                    View Question
                  </motion.button>
                </div>
              </div>

              {/* Upload Resource File Section */}
              <div className="mt-3">
                <div className="flex items-center">
                  <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload Resource File</div>
                  <div className="ml-2">
                    <input
                      type="file"
                      id="resourceFile"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resourceFile" className="cursor-pointer">
                      <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                        <FaUpload size={10} className="text-white" />
                      </div>
                    </label>
                  </div>
                  <motion.button
                    onClick={handleResourceUpload}
                    disabled={!selectedFile}
                    className="ml-4 w-24 h-8 bg-purple-800 rounded-[3px] text-white text-xs flex items-center justify-center disabled:bg-gray-400"
                  >
                    Upload
                  </motion.button>
                </div>

                <div className="mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteResources}
                    className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    disabled={resources === 0}
                  >
                    Delete Resources
                  </motion.button>
                </div>
              </div>
            </div>
          </AdminBox>

          {/* Second rectangle - Network Design */}
          <NetworkDesignSection
            resources={resources}
            responses={responses}
            handleFileChange={handleFileChange}
            handleNetworkResourceUpload={handleNetworkResourceUpload}
            handleDeleteNetworkResources={handleDeleteNetworkResources}
            handleResponseUpload={handleResponseUpload}
            handleDownloadResources={handleDownloadResources}
            selectedFile={selectedFile}
          />

          {/* Third rectangle - Questioners Responses */}
          <QuestionersResponsesSection
            responses={responses}
            handleDownloadResources={handleDownloadResources}
            resources={resources}
          />

          {/* Fourth rectangle - Allocate Time */}
          <AdminBox title="Allocate Time" width="w-48" minHeight="200px">
            {/* Underline */}
            <img src="/under-line.png" alt="underline" className="w-full h-1" />
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

        {/* Teams Section */}
        <TeamsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          teams={schools}
          handleViewTeam={handleViewTeam}
          viewingTeam={viewingTeam}
          teamQuestions={teamQuestions}
          handleBackToTeams={handleBackToTeams}
          handleMarkCorrect={handleMarkCorrect}
          handleMarkIncorrect={handleMarkIncorrect}
        />

        {/* Modals */}
        <ModalComponents
          showDeleteQuestionsModal={showDeleteQuestionsModal}
          setShowDeleteQuestionsModal={setShowDeleteQuestionsModal}
          confirmDeleteQuestions={confirmDeleteQuestions}
          showDeleteResourcesModal={showDeleteResourcesModal}
          setShowDeleteResourcesModal={setShowDeleteResourcesModal}
          confirmDeleteResources={confirmDeleteResources}
          showDeleteNetworkResourceModal={showDeleteNetworkResourceModal}
          setShowDeleteNetworkResourceModal={setShowDeleteNetworkResourceModal}
          confirmDeleteNetworkResources={confirmDeleteNetworkResources}
          alertModal={alertModal}
          closeAlert={closeAlert}
        />

        {/* Custom scrollbar styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
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
        `
        }} />
      </>
    </AdminLayout>
  );
}
