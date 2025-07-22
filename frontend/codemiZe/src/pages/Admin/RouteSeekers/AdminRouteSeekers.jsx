import React, { useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTrashAlt, FaDownload, FaEye } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
{/* Alert and Confirmation modals are now imported via ModalComponents */ }
import { TeamQuestionsView, QuestionersResponsesSection, NetworkDesignSection, TeamsSection, ModalComponents } from '../../../components/Admin/RouteComponents';

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
                    onClick={handleDeleteQuestions}
                    className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    disabled={questions === 0}
                  >
                    Delete Question
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewQuestions}
                    className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
                    disabled={questions === 0}
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
