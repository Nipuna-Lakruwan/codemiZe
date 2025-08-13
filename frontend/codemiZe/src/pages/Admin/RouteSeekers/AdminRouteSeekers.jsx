import React, { useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTrashAlt, FaDownload, FaEye } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
{/* Alert and Confirmation modals are now imported via ModalComponents */ }
import {
  TeamQuestionsView,
  QuestionersResponsesSection,
  NetworkDesignSection,
  TeamsSection,
  ModalComponents,
  QuestionnaireSection,
  AllocateTimeSection,
  CustomScrollbarStyles
} from '../../../components/Admin/RouteComponents';

export default function AdminRouteSeekers() {
  // States for resources
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState(8); // Initial questions count
  const [resources, setResources] = useState(5); // Initial resources count
  const [responses, setResponses] = useState(12); // Initial responses count
  const [allocatedTime, setAllocatedTime] = useState(30); // Default 30 minutes
  const [customTime, setCustomTime] = useState("");
  const [activeTab, setActiveTab] = useState('Questioners');

  // States for team questions view
  const [viewingTeam, setViewingTeam] = useState(null);
  const [teamQuestions, setTeamQuestions] = useState([]);

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

  // Sample questions data - in a real app, this would come from an API or database
  const sampleQuestions = [
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
    },
    {
      id: 8,
      question: "What protocol is used for secure web browsing?",
      correctAnswer: "HTTPS",
      answer: "HTTPS (HTTP Secure)",
      status: null
    },
    {
      id: 9,
      question: "What does LAN stand for?",
      correctAnswer: "Local Area Network",
      answer: "Local Area Network",
      status: null
    },
    {
      id: 10,
      question: "What does TCP/IP stand for?",
      correctAnswer: "Transmission Control Protocol/Internet Protocol",
      answer: "Transmission Control Protocol/Internet Protocol",
      status: null
    }
  ];

  // View functions
  const handleViewQuestions = () => {
    showAlert('Viewing all questions', 'Questions View', 'info');
  };

  const handleViewTeam = (team) => {
    // Load questions for this team
    // In a real app, you would fetch the team's specific answers from your backend
    setTeamQuestions(sampleQuestions.map(q => ({ ...q, status: null })));
    setViewingTeam(team);
  };

  const handleBackToTeams = () => {
    setViewingTeam(null);
    setTeamQuestions([]);
  };

  const handleMarkCorrect = (questionIndex) => {
    setTeamQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        status: 'correct'
      };
      return newQuestions;
    });
  };

  const handleMarkIncorrect = (questionIndex) => {
    setTeamQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        status: 'incorrect'
      };
      return newQuestions;
    });
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
      {/* Main Admin Dashboard */}
      <>
        {/* Top row with main rectangles */}
        <div className="flex flex-wrap gap-6 mb-8">
          {/* First rectangle - Questionnaire */}
          <QuestionnaireSection
            handleFileChange={handleFileChange}
            handleDeleteQuestions={handleDeleteQuestions}
            handleViewQuestions={handleViewQuestions}
            handleDeleteResources={handleDeleteResources}
            questions={questions}
            resources={resources}
          />

          {/* Second rectangle - Network Design */}
          <NetworkDesignSection
            resources={resources}
            responses={responses}
            handleFileChange={handleFileChange}
            handleDeleteNetworkResources={handleDeleteNetworkResources}
            handleResponseUpload={handleResponseUpload}
            handleDownloadResources={handleDownloadResources}
          />

          {/* Third rectangle - Questioners Responses */}
          <QuestionersResponsesSection
            responses={responses}
            handleDownloadResources={handleDownloadResources}
            resources={resources}
          />

          {/* Fourth rectangle - Allocate Time */}
          <AllocateTimeSection
            allocatedTime={allocatedTime}
            customTime={customTime}
            handleTimeChange={handleTimeChange}
            handleCustomTimeChange={handleCustomTimeChange}
            handleConfirmTime={handleConfirmTime}
          />
        </div>

        {/* Teams Section */}
        <TeamsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          teams={teams}
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
        <CustomScrollbarStyles />
      </>
    </AdminLayout>
  );
}
