import React, { useEffect, useState } from 'react';
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
  const [resources, setResources] = useState(0); // Start with 0, will be fetched
  const [allocatedTime, setAllocatedTime] = useState(30); // Default 30 minutes
  const [customTime, setCustomTime] = useState("");

  // Marking state
  const [activeJudge, setActiveJudge] = useState('');
  const [teams, setTeams] = useState([]);
  const [criteria, setCriteria] = useState([]);

  // Initiate teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS);
        const schools = response.data.schools.map(item => item.nameInShort);
        setTeams(schools);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // Fetch initial allocated time
  useEffect(() => {
    const fetchAllocatedTime = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_TIME);
        // Convert seconds to minutes for display
        const timeInMinutes = Math.round(response.data.allocateTime / 60);
        setAllocatedTime(timeInMinutes);
      } catch (error) {
        console.error('Error fetching allocated time:', error);
      }
    };
    fetchAllocatedTime();
  }, []);

  // Fetch resource count
  useEffect(() => {
    const fetchResourceCount = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_RESOURCE_COUNT);
        setResources(response.data.count);
      } catch (error) {
        console.error('Error fetching resource count:', error);
      }
    };
    fetchResourceCount();
  }, []);

  // Initialize criteria for marking
  useEffect(() => {
    const getCriteria = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_CRITERIA);
        const criteriaStrings = response.data.criteria.map(item => item.criteria);
        setCriteria(criteriaStrings);
      } catch (error) {
        console.error('Error fetching criteria:', error);
      }
    };
    getCriteria();
  }, []);

  // Sample marking data
  const [markings, setMarkings] = useState();
  const [judgeNames, setJudgeNames] = useState([]);

  useEffect(() => {
    const fetchMarkings = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_MARKINGS);
        // If response is in the format { Judge: {...} }, extract accordingly
        let data = response.data;
        let judgeKeys = Object.keys(data || {});
        setMarkings(data);
        setJudgeNames(judgeKeys);
        
        // Set default active judge to Overall if it exists, otherwise first judge
        if (judgeKeys.includes('Overall')) {
          setActiveJudge('Overall');
        } else if (judgeKeys.length > 0) {
          setActiveJudge(judgeKeys[0]);
        }
      } catch (error) {
        console.error('Error fetching markings:', error);
      }
    };
    fetchMarkings();
  }, []);

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
      try {
        // Here you would handle the resource upload to the backend
        const formData = new FormData();
        formData.append('resource', selectedFile);

        await axiosInstance.post(API_PATHS.CODE_CRUSHERS.UPLOAD_RESOURCE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Refresh resource count after successful upload
        const countResponse = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_RESOURCE_COUNT);
        setResources(countResponse.data.count);

        showAlert('Resource uploaded: ' + selectedFile.name, 'Upload Successful', 'success');
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading resource:', error);
        showAlert('Failed to upload resource', 'Upload Error', 'error');
      }
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

  const handleConfirmTime = async () => {
    const timeToUse = allocatedTime === 'custom' ? parseInt(customTime) : allocatedTime;
    if (allocatedTime === 'custom' && (!customTime || isNaN(parseInt(customTime)))) {
      showAlert('Please enter a valid time in minutes', 'Time Allocation Error', 'error');
      return;
    }

    try {
      // Convert minutes to seconds for backend storage
      const timeInSeconds = timeToUse * 60;
      await axiosInstance.post(API_PATHS.CODE_CRUSHERS.SET_TIME, { allocateTime: timeInSeconds });
      showAlert(`Time allocated: ${timeToUse} minutes`, 'Time Allocation', 'success');
    } catch (error) {
      console.error('Error setting time:', error);
      showAlert('Failed to set allocated time', 'Time Allocation Error', 'error');
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
            {/* Tab Rectangle - dynamic judge names */}
            <div className="relative bg-white rounded-lg border-2 border-gray-300 shadow-sm" style={{ width: `${(judgeNames.filter(j => j !== 'Overall').length + 1) * 151}px`, minWidth: '302px', height: '40px' }}>
              <div
                className="absolute left-0 top-0 h-full bg-sky-600 rounded-lg transition-all duration-300"
                style={{
                  width: '151px',
                  transform: `translateX(${(() => {
                    if (activeJudge === 'Overall') return 0;
                    const judgeIndex = judgeNames.filter(j => j !== 'Overall').findIndex(j => j === activeJudge);
                    return (judgeIndex + 1) * 151;
                  })()}px)`
                }}
              />
              <div className="absolute inset-0 flex items-center">
                <div className="flex w-full">
                  <div className="w-[151px] flex items-center justify-center">
                    <span
                      className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === 'Overall' ? 'text-white' : 'text-gray-700'}`}
                      onClick={() => handleJudgeChange('Overall')}
                    >
                      Overall
                    </span>
                  </div>
                  {judgeNames.filter(judge => judge !== 'Overall').map((judge) => (
                    <div key={judge} className="w-[151px] flex items-center justify-center">
                      <span
                        className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeJudge === judge ? 'text-white' : 'text-gray-700'}`}
                        onClick={() => handleJudgeChange(judge)}
                      >
                        {judge}
                      </span>
                    </div>
                  ))}
                </div>
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
                          {(() => {
                            if (!markings) return "-";
                            let judgeData = markings[activeJudge];
                            
                            if (!judgeData && Object.keys(markings).length === 1) {
                              judgeData = markings[Object.keys(markings)[0]];
                            }
                            
                            if (judgeData && judgeData[team] && judgeData[team][index] !== undefined) {
                              return judgeData[team][index];
                            }
                            return "-";
                          })()}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-purple-100 border-t-2 border-purple-800">
                    <td className="py-2 px-4 border-b border-r text-left text-sm font-bold text-purple-800">
                      Total
                    </td>
                    {teams.map((team) => (
                      <td key={`${team}-total`} className="py-2 px-4 border-b border-r text-center text-sm font-bold text-purple-800">
                        {(() => {
                          if (!markings) return "-";
                          let judgeData = markings[activeJudge];
                          
                          if (!judgeData && Object.keys(markings).length === 1) {
                            judgeData = markings[Object.keys(markings)[0]];
                          }
                          
                          if (judgeData && judgeData[team]) {
                            // Get the last element which is the total
                            const totalIndex = judgeData[team].length - 1;
                            return judgeData[team][totalIndex] || "-";
                          }
                          return "-";
                        })()}
                      </td>
                    ))}
                  </tr>
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
