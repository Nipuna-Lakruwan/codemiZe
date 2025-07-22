import React, { useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTrashAlt, FaDownload, FaEye } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';

// Import separated components
import {
  QuestionnaireSection,
  NetworkDesignSection,
  QuestionersResponsesSection,
  AllocateTimeSection,
  TeamsSection,
  ModalComponents
} from './components';

export default function AdminRouteSeekers() {
  // States for resources
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState(8); // Initial questions count
  const [resources, setResources] = useState(5); // Initial resources count
  const [responses, setResponses] = useState(12); // Initial responses count
  const [allocatedTime, setAllocatedTime] = useState(30); // Default 30 minutes
  const [customTime, setCustomTime] = useState("");
  const [activeTab, setActiveTab] = useState('Questioners');

  // Team data
  const [teams, setTeams] = useState([
    { id: 1, name: 'Sri Sangabodhi Central College', city: 'Dankotuwa', logo: '/college-logos/sangabodhi.png', score: 85 },
    { id: 2, name: 'Royal College', city: 'Colombo', logo: '/college-logos/royal.png', score: 92 },
    { id: 3, name: 'Ananda College', city: 'Colombo', logo: '/college-logos/ananda.png', score: 88 },
    { id: 4, name: 'Nalanda College', city: 'Colombo', logo: '/college-logos/nalanda.png', score: 90 },
    { id: 5, name: 'D.S. Senanayake College', city: 'Colombo', logo: '/college-logos/ds.png', score: 82 },
    { id: 6, name: 'Maliyadeva College', city: 'Kurunegala', logo: '/college-logos/maliyadeva.png', score: 79 },
    { id: 7, name: 'St. Joseph\'s College', city: 'Colombo', logo: '/college-logos/stjoseph.png', score: 86 },
    { id: 8, name: 'Rahula College', city: 'Matara', logo: '/college-logos/rahula.png', score: 81 }
  ]);

  // Modal states
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', or 'error'
  });
  const [showDeleteQuestionsModal, setShowDeleteQuestionsModal] = useState(false);
  const [showDeleteResourcesModal, setShowDeleteResourcesModal] = useState(false);
  const [showDeleteNetworkResourceModal, setShowDeleteNetworkResourceModal] = useState(false);

  // File handling functions
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleQuestionUpload = () => {
    if (selectedFile) {
      console.log('Uploading questions:', selectedFile);
      showAlert('Questions uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
      setQuestions(questions + 5); // Simulate adding 5 new questions
      setSelectedFile(null);
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleResourceUpload = () => {
    if (selectedFile) {
      console.log('Uploading resource:', selectedFile);
      showAlert('Resource uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
      setResources(resources + 1);
      setSelectedFile(null);
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  const handleNetworkResourceUpload = () => {
    if (selectedFile) {
      console.log('Uploading network resource:', selectedFile);
      showAlert('Network resource uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
      setResources(resources + 1);
      setSelectedFile(null);
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

  const confirmDeleteQuestions = () => {
    setQuestions(0);
    setShowDeleteQuestionsModal(false);
    showAlert('All questions have been deleted', 'Delete Successful', 'success');
  };

  const handleDeleteResources = () => {
    setShowDeleteResourcesModal(true);
  };

  const confirmDeleteResources = () => {
    setResources(0);
    setShowDeleteResourcesModal(false);
    showAlert('All resources have been deleted', 'Delete Successful', 'success');
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
  };

  const handleViewTeam = (team) => {
    showAlert(`Viewing team: ${team.name}`, 'Team View', 'info');
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

  const handleConfirmTime = () => {
    const timeToUse = allocatedTime === 'custom' ? parseInt(customTime) : allocatedTime;
    if (allocatedTime === 'custom' && (!customTime || isNaN(parseInt(customTime)))) {
      showAlert('Please enter a valid time in minutes', 'Time Allocation Error', 'error');
      return;
    }
    showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
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

  return (
    <AdminLayout>
      {/* Top row with main rectangles */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Using the separated components */}
        <QuestionnaireSection
          handleFileChange={handleFileChange}
          handleDeleteQuestions={handleDeleteQuestions}
          handleViewQuestions={handleViewQuestions}
          handleDeleteResources={handleDeleteResources}
          questions={questions}
          resources={resources}
        />

        <NetworkDesignSection
          handleFileChange={handleFileChange}
          handleNetworkResourceUpload={handleNetworkResourceUpload}
          handleDeleteNetworkResources={handleDeleteNetworkResources}
          handleResponseUpload={handleResponseUpload}
          handleDownloadResources={handleDownloadResources}
          resources={resources}
          responses={responses}
        />

        {/* Third rectangle - Questioners Responses and Fourth rectangle - Allocate Time */}
        <div className="flex flex-col gap-6">
          <QuestionersResponsesSection responses={responses} />

          <AllocateTimeSection
            allocatedTime={allocatedTime}
            customTime={customTime}
            handleTimeChange={handleTimeChange}
            handleCustomTimeChange={handleCustomTimeChange}
            handleConfirmTime={handleConfirmTime}
          />
        </div>
      </div>

      {/* Teams Section */}
      <TeamsSection
        teams={teams}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleViewTeam={handleViewTeam}
      />

      {/* Modal Components */}
      <ModalComponents
        alertModal={alertModal}
        closeAlert={closeAlert}
        showDeleteQuestionsModal={showDeleteQuestionsModal}
        setShowDeleteQuestionsModal={setShowDeleteQuestionsModal}
        confirmDeleteQuestions={confirmDeleteQuestions}
        showDeleteResourcesModal={showDeleteResourcesModal}
        setShowDeleteResourcesModal={setShowDeleteResourcesModal}
        confirmDeleteResources={confirmDeleteResources}
        showDeleteNetworkResourceModal={showDeleteNetworkResourceModal}
        setShowDeleteNetworkResourceModal={setShowDeleteNetworkResourceModal}
        confirmDeleteNetworkResources={confirmDeleteNetworkResources}
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
    </AdminLayout>
  );
}
