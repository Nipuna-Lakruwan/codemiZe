import React, { useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaDownload, FaFilePdf } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import { API_PATHS } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

export default function AdminCodeCrushers() {
  // Resources state
  const [selectedFile, setSelectedFile] = useState(null);
  const [resources, setResources] = useState(5); // Initial resources count
  const [allocatedTime, setAllocatedTime] = useState(30); // Default 30 minutes
  const [customTime, setCustomTime] = useState("");

  // Marking state
  const [activeJudge, setActiveJudge] = useState('Overall Score');
  const [teams, setTeams] = useState([
    'Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5',
    'Team 6', 'Team 7', 'Team 8', 'Team 9', 'Team 10'
  ]);
  const [criteria, setCriteria] = useState([
    'Code Quality', 'Functionality', 'Efficiency', 'Innovation', 'UI/UX', 'Documentation', 'Total'
  ]);

  // Sample marking data
  const [markings, setMarkings] = useState({
    'Overall Score': {
      'Team 1': [8, 7, 9, 6, 8, 7, 45],
      'Team 2': [9, 8, 7, 8, 9, 8, 49],
      'Team 3': [7, 8, 6, 7, 6, 7, 41],
      'Team 4': [8, 9, 7, 8, 7, 8, 47],
      'Team 5': [9, 8, 8, 9, 8, 9, 51],
      'Team 6': [7, 7, 6, 8, 7, 6, 41],
      'Team 7': [8, 7, 8, 7, 8, 8, 46],
      'Team 8': [6, 7, 8, 6, 7, 7, 41],
      'Team 9': [9, 8, 9, 9, 8, 9, 52],
      'Team 10': [8, 7, 8, 7, 8, 7, 45]
    },
    'Nipuna': {
      'Team 1': [8, 7, 8, 6, 7, 7, 43],
      'Team 2': [9, 8, 8, 8, 9, 8, 50],
      'Team 3': [7, 7, 6, 7, 6, 7, 40],
      'Team 4': [8, 9, 7, 8, 7, 8, 47],
      'Team 5': [9, 8, 8, 9, 8, 9, 51],
      'Team 6': [7, 7, 6, 7, 7, 7, 41],
      'Team 7': [8, 8, 8, 7, 8, 7, 46],
      'Team 8': [6, 7, 7, 7, 7, 7, 41],
      'Team 9': [9, 9, 9, 9, 8, 9, 53],
      'Team 10': [8, 7, 8, 7, 8, 7, 45]
    },
    'Sohan': {
      'Team 1': [9, 7, 9, 7, 8, 8, 48],
      'Team 2': [8, 8, 7, 8, 9, 8, 48],
      'Team 3': [6, 8, 7, 6, 7, 7, 41],
      'Team 4': [8, 8, 7, 8, 8, 8, 47],
      'Team 5': [9, 8, 9, 8, 8, 9, 51],
      'Team 6': [7, 7, 6, 8, 7, 6, 41],
      'Team 7': [8, 7, 7, 7, 8, 8, 45],
      'Team 8': [7, 7, 8, 6, 7, 7, 42],
      'Team 9': [9, 8, 8, 9, 8, 8, 50],
      'Team 10': [7, 7, 8, 8, 7, 7, 44]
    },
    'Waruna': {
      'Team 1': [8, 7, 9, 6, 8, 7, 45],
      'Team 2': [9, 8, 7, 8, 9, 8, 49],
      'Team 3': [7, 8, 6, 7, 6, 7, 41],
      'Team 4': [8, 9, 7, 8, 7, 8, 47],
      'Team 5': [8, 8, 8, 9, 7, 9, 49],
      'Team 6': [7, 7, 6, 8, 7, 6, 41],
      'Team 7': [8, 7, 8, 7, 8, 8, 46],
      'Team 8': [6, 7, 8, 6, 7, 7, 41],
      'Team 9': [9, 8, 9, 9, 8, 9, 52],
      'Team 10': [8, 7, 8, 7, 8, 7, 45]
    }
  });

  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', or 'error'
  });

  // No confirmation modals needed

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleResourceUpload = async () => {
    if (selectedFile) {
      // Here you would handle the resource upload to the backend
      const formData = new FormData();
      formData.append('slides', selectedFile);

      await axiosInstance.post(API_PATHS.CODE_CRUSHERS.UPLOAD_SLIDES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showAlert('Resource uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
      // Simulating new resources added
      setResources(resources + 1);
      setSelectedFile(null);
    } else {
      showAlert('Please select a file first', 'Upload Error', 'error');
    }
  };

  // No response upload or delete resources functionality

  const handleDownloadResources = async () => {
    try {
    showAlert('Resources are being downloaded', 'Download Started', 'info');
    const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_ALL_RESOURCES, { responseType: "blob" });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "codeCrushers-resources.zip");
    document.body.appendChild(link);
    link.click();
    link.remove();

    } catch (error) {
      console.error('Error downloading resources:', error);
      showAlert('Failed to download resources', 'Download Error', 'error');
    }
  };

  const handleDownloadPDF = () => {
    showAlert('Marking sheet is being downloaded as PDF', 'Download Started', 'info');
    // Here you would implement the PDF generation and download logic
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

  const handleJudgeChange = (judgeName) => {
    setActiveJudge(judgeName);
  };

  return (
    <AdminLayout>
      {/* Top row with three rectangles */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* First rectangle - Upload Resources */}
        <AdminBox title="Upload Resources" width="flex-1 min-w-[300px]" minHeight="200px">
          <div className="flex flex-col space-y-6 mt-7">
            <div className="flex items-center gap-4">
              <div className="justify-start text-black/60 text-sm font-medium font-['Inter']">Upload Resource File</div>
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
                onClick={handleResourceUpload}
                className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium"
                disabled={!selectedFile}
              >
                <FaFileAlt size={14} />
                Upload Resource
              </motion.button>
            </div>
          </div>
        </AdminBox>

        {/* Second rectangle - Total Resources */}
        <AdminBox title="Total Resources" width="flex-grow min-w-[300px] max-w-[400px]" minHeight="200px">
          <div className="flex flex-col space-y-6 mt-7">
            <div className="flex flex-col items-center gap-4">
              <div className="text-purple-800 text-4xl font-semibold font-['Inter']">{resources}</div>
              <div className="text-sky-600 text-lg font-semibold font-['Oxanium'] mb-2">Resources</div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadResources}
                className="flex items-center gap-2 h-10 bg-sky-600 rounded-[3px] text-white px-4 text-sm font-medium mt-4"
                disabled={resources === 0}
              >
                <FaDownload size={14} />
                Download Resources
              </motion.button>
            </div>
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

      {/* Marking Section */}
      <AdminBox title="Marking Sheet" minHeight="auto">
        <div className="mt-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            {/* Tab Rectangle */}
            <div className="relative w-[604px] h-10 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
              <div
                className="absolute left-0 top-0 h-full bg-sky-600 rounded-lg transition-all duration-300"
                style={{
                  width: '151px',
                  transform: activeJudge === 'Overall Score' ? 'translateX(0)' :
                    activeJudge === 'Nipuna' ? 'translateX(151px)' :
                      activeJudge === 'Sohan' ? 'translateX(302px)' : 'translateX(453px)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span
                  className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === 'Overall Score' ? 'text-white' : 'text-gray-700'}`}
                  onClick={() => handleJudgeChange('Overall Score')}
                >
                  Overall Score
                </span>
                <span
                  className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === 'Nipuna' ? 'text-white' : 'text-gray-700'}`}
                  onClick={() => handleJudgeChange('Nipuna')}
                >
                  Nipuna
                </span>
                <span
                  className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === 'Sohan' ? 'text-white' : 'text-gray-700'}`}
                  onClick={() => handleJudgeChange('Sohan')}
                >
                  Sohan
                </span>
                <span
                  className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === 'Waruna' ? 'text-white' : 'text-gray-700'}`}
                  onClick={() => handleJudgeChange('Waruna')}
                >
                  Waruna
                </span>
              </div>
            </div>

            {/* Download PDF button moved to the right */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 h-10 bg-purple-800 rounded-[3px] text-white px-4 text-sm font-medium"
            >
              <FaFilePdf size={14} />
              Download PDF
            </motion.button>
          </div>

          {/* Marking Table */}
          <div className="overflow-x-auto">
            <div className="p-1 border-4 border-black rounded-xl">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b border-r text-left text-sm font-medium text-purple-800">Criteria</th>
                    {teams.map((team) => (
                      <th key={team} className="py-3 px-4 border-b border-r text-center text-sm font-medium text-purple-800">
                        {team}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((criterion, index) => (
                    <tr key={criterion} className={index === criteria.length - 1 ? "bg-purple-50" : ""}>
                      <td className={`py-2 px-4 border-b border-r text-left text-sm font-medium ${index === criteria.length - 1 ? "text-purple-800" : "text-gray-700"}`}>
                        {criterion}
                      </td>
                      {teams.map((team) => (
                        <td key={`${team}-${criterion}`} className={`py-2 px-4 border-b border-r text-center text-sm ${index === criteria.length - 1 ? "font-bold text-purple-800" : "text-gray-700"}`}>
                          {markings[activeJudge][team][index]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminBox>

      {/* No delete resources confirmation modal needed */}

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
