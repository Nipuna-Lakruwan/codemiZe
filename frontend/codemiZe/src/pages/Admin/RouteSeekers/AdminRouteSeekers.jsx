import React, { useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaTrashAlt, FaDownload, FaEye } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';

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
        {/* First rectangle - Questionnaire */}
        <AdminBox title="Questionnaire" width="flex-1 min-w-[300px]" minHeight="320px">
          <div className="flex flex-col space-y-6 mt-4">
            {/* Upload Questions Section */}
            <div className="mb-4">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter'] mb-2">Upload Questions</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
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

                {selectedFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuestionUpload}
                  className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={!selectedFile}
                >
                  <FaFileAlt size={14} />
                  Upload Questions
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteQuestions}
                  className="flex items-center gap-2 h-10 bg-red-500 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={questions === 0}
                >
                  <FaTrashAlt size={14} />
                  Delete Questions
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewQuestions}
                  className="flex items-center gap-2 h-10 bg-purple-800 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={questions === 0}
                >
                  <FaEye size={14} />
                  View Questions
                </motion.button>
              </div>
            </div>

            {/* Upload Resource File Section */}
            <div className="mt-6">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter'] mb-2">Upload Resource File</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
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

                {selectedFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResourceUpload}
                  className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={!selectedFile}
                >
                  <FaFileAlt size={14} />
                  Upload Resource
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteResources}
                  className="flex items-center gap-2 h-10 bg-red-500 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={resources === 0}
                >
                  <FaTrashAlt size={14} />
                  Delete Resources
                </motion.button>
              </div>
            </div>
          </div>
        </AdminBox>

        {/* Second rectangle - Network Design */}
        <AdminBox title="Network Design" width="flex-1 min-w-[300px]" minHeight="320px">
          <div className="flex flex-col space-y-6 mt-4">
            {/* Upload Resource File Section */}
            <div className="mb-4">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter'] mb-2">Upload Resource File</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
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

                {selectedFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNetworkResourceUpload}
                  className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={!selectedFile}
                >
                  <FaFileAlt size={14} />
                  Upload Resource
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteNetworkResources}
                  className="flex items-center gap-2 h-10 bg-red-500 rounded-[3px] text-white px-4 text-sm font-medium"
                  disabled={resources === 0}
                >
                  <FaTrashAlt size={14} />
                  Delete Resources
                </motion.button>
              </div>
            </div>

            {/* Upload Responses Section */}
            <div className="mt-4">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter'] mb-2">Upload Responses</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
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

                {selectedFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="text-purple-800 text-3xl font-semibold font-['Inter'] text-center">{resources}</div>
                <div className="text-sky-600 text-lg font-semibold font-['Oxanium'] text-center mb-4">Resources</div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadResources}
                  className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium mx-auto"
                  disabled={resources === 0}
                >
                  <FaDownload size={14} />
                  Download Resources
                </motion.button>
              </div>
            </div>
          </div>
        </AdminBox>

        {/* Third rectangle - Questioners Responses */}
        <AdminBox title="Questioners Responses" width="w-56" minHeight="200px">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-purple-800 text-4xl font-semibold font-['Inter'] mt-4">{responses}</div>
            <div className="text-sky-600 text-lg font-semibold font-['Oxanium'] mb-2">Responses</div>
          </div>
        </AdminBox>

        {/* Fourth rectangle - Allocate Time */}
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

      {/* Teams Section */}
      <AdminBox title="Teams" minHeight="auto">
        <div className="mt-6 mb-6">
          {/* Tabs */}
          <div className="flex mb-6 justify-center">
            <div className="w-[462px] h-9 bg-white rounded-[3px] border border-black/20 flex items-center">
              <div
                className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Questioners' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
                onClick={() => setActiveTab('Questioners')}
              >
                <span className="text-xs font-medium">Questioners</span>
              </div>
              <div
                className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Network Diagrams' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
                onClick={() => setActiveTab('Network Diagrams')}
              >
                <span className="text-xs font-medium">Network Diagrams</span>
              </div>
              <div
                className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Total Marks' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
                onClick={() => setActiveTab('Total Marks')}
              >
                <span className="text-xs font-medium">Total Marks</span>
              </div>
            </div>
          </div>

          {/* Teams List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {teams.map(team => (
              <div
                key={team.id}
                className="w-[860px] h-16 bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-sky-400 mx-auto flex items-center"
              >
                {/* Team Logo */}
                <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center">
                  <img src={team.logo || "/c-logo.png"} alt={team.name} className="max-w-full max-h-full object-cover" />
                </div>

                {/* Team Info */}
                <div className="flex-1 px-4">
                  <div className="justify-start text-black text-base font-medium font-['Oxanium']">
                    {team.name}
                  </div>
                  <div className="justify-start text-black/70 text-xs font-medium font-['Inter']">
                    {team.city}
                  </div>
                </div>

                {/* View Button */}
                <div className="pr-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewTeam(team)}
                    className="w-20 h-7 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white text-xs flex items-center justify-center"
                  >
                    View
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminBox>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteQuestionsModal}
        onClose={() => setShowDeleteQuestionsModal(false)}
        onConfirm={confirmDeleteQuestions}
        title="Delete All Questions"
        message="Are you sure you want to delete ALL questions? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteResourcesModal}
        onClose={() => setShowDeleteResourcesModal(false)}
        onConfirm={confirmDeleteResources}
        title="Delete All Resources"
        message="Are you sure you want to delete ALL resources? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteNetworkResourceModal}
        onClose={() => setShowDeleteNetworkResourceModal(false)}
        onConfirm={confirmDeleteNetworkResources}
        title="Delete All Network Resources"
        message="Are you sure you want to delete ALL network resources? This action cannot be undone."
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
