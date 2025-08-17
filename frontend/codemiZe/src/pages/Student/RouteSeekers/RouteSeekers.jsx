import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import QuestionnaireActivity from '../../../components/Student/QuestionnaireActivity';
import ActivitySelection from '../../../components/Student/ActivitySelection';
import axiosInstance from '../../../utils/axiosInstance';
import PdfViewer from '../../../components/Student/PDFViewer/PdfViewer';

export default function RouteSeekers() {
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [activity, setActivity] = useState(null); // 'questionnaire' or 'network'
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [networkCompleted, setNetworkCompleted] = useState(false);
  const [showNextActivityPopup, setShowNextActivityPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // PDF viewer state
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const fileInputRef = useRef(null);

  // Questionnaire state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isGameStarted && !gameCompleted && !timeIsUp && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === 5 * 60) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 5000);
          }
          else if (prev === 60) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 5000);
          }

          if (prev <= 1) {
            clearInterval(timer);
            setTimeIsUp(true);
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted, gameCompleted, timeRemaining]);

  // Countdown for next activity popup
  useEffect(() => {
    let timer;
    if (showNextActivityPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showNextActivityPopup && countdown === 0) {
      setActivity('network');
      setShowNextActivityPopup(false);
      setCountdown(5); // Reset for next time
    }
    return () => clearInterval(timer);
  }, [showNextActivityPopup, countdown]);

  useEffect(() => {
    if (isGameStarted && activity === 'questionnaire' && questions.length === 0) {
      const fetchQuestions = async () => {
        try {
          const response = await axiosInstance.get('/api/v1/route-seekers/questions');
          const fetchedQuestions = response.data;
          setQuestions(fetchedQuestions);
          // Initialize answers once with empty strings
          setAnswers(fetchedQuestions.map(q => ({ questionId: q._id, answer: '' })));
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };
      fetchQuestions();
    }
  }, [isGameStarted, activity, questions.length]);

  useEffect(() => {
    const fetchPdf = async () => {
      setPdfError(null);
      try {
        // 1. Get PDF metadata
        const metaResponse = await axiosInstance.get('/api/v1/questions/route-seekers/network-design/first');
        const pdfFile = metaResponse.data;

        if (pdfFile && pdfFile.path) {
          const fullPath = pdfFile.path;
          const uploadsToken = 'uploads';
          const uploadsIndex = fullPath.indexOf(uploadsToken);

          if (uploadsIndex !== -1) {
            const relativePath = fullPath.substring(uploadsIndex);
            const pdfUrlPath = `/${relativePath.replace(/\\/g, '/')}`;

            // 2. Fetch PDF data as a blob
            const pdfResponse = await axiosInstance.get(
              pdfUrlPath,
              { responseType: 'blob' } // Important
            );
            // 3. Create a blob URL
            const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
          } else {
            setPdfError("Invalid PDF path received from server. 'uploads' directory not in path.");
          }
        } else {
          setPdfError("Network design PDF not found. Please contact an administrator.");
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
        if (error.response?.status === 404) {
          setPdfError("Network design PDF not found. Please contact an administrator.");
        } else {
          setPdfError('Failed to load the network design PDF.');
        }
      }
    };

    if (activity === 'network' && !pdfUrl) {
      fetchPdf();
    }

    // Cleanup blob URL on component unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [activity, pdfUrl]);

  // Start game handler
  const handleStartGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGameStarted(true);
      setIsLoading(false);
    }, 1500);
  };

  // File upload handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      setUploadedFile(file);
      setIsFileValid(true);
    } else {
      setUploadedFile(file);
      setIsFileValid(false);
    }
  };

  const handleNetworkDesignUpload = async () => {
    if (!isFileValid || !uploadedFile) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      await axiosInstance.post('/api/v1/route-seekers/upload-network-design', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNetworkCompleted(true);
      if (questionnaireCompleted) {
        setGameCompleted(true);
      }
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show an error to the user here
    }
  };

  // Questionnaire handlers - memoized to prevent recreation on each render
  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(a => a.questionId === questionId ? { ...a, answer: value } : a)
    );
  }, []);

  // Memoize the submission handler to prevent recreation
  const handleSubmitQuestionnaire = useCallback(async () => {
    try {
      await axiosInstance.post('/api/v1/route-seekers/submit', { answers });
      setQuestionnaireCompleted(true);
      setShowNextActivityPopup(true);
      if (networkCompleted) {
        setGameCompleted(true);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  }, [answers, networkCompleted]);

  // Game end handler (time's up)
  const handleGameEnd = () => {
    if (isFileValid && uploadedFile) {
      setTimeout(() => {
        if (timeIsUp && !gameCompleted) {
          setGameCompleted(true);
        }
      }, 15000);
    }
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for timer
  const calculateProgress = () => {
    return (timeRemaining / (45 * 60)) * 100;
  };

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/questions/route-seekers/resource-files');
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    if (showResourcesModal) {
      fetchResources();
    }
  }, [showResourcesModal]);

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/questions/route-seekers/download-resource/${fileId}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const pdfContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(140, 20, 252, 0.4)",
      transition: {
        duration: 0.2
      }
    }
  };

  // Animation variants are defined once and passed to child components
  const animationVariants = useMemo(() => ({
    cardVariants,
    pdfContainerVariants
  }), []);

  // Memoize the activity setter to prevent recreation
  const handleSetActivity = useCallback((value) => {
    setActivity(value);
  }, []);  // Custom scrollbar styling
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(133, 94, 194, 0.5);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(133, 94, 194, 0.7);
    }
  `;

  return (
    <GameLayout gameName={isGameStarted && !gameCompleted ? "Route Seekers" : ""}>
      <style>{scrollbarStyles}</style>
      {!isGameStarted ? (
        <StartGameComponent
          title="Route Seekers"
          iconSrc="/circuit samshers logo 1.png"
          iconAlt="Route Seekers"
          onStart={handleStartGame}
          isLoading={isLoading}
          topRightImageSrc="/robo1.png"
          bottomLeftImageSrc="/robo2.png"
          showScoreInfo={false}
        />
      ) : gameCompleted ? (
        // Game completed screen
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
          {/* Top left decorative image */}
          <img
            src="/left-robo.png"
            alt="Robot Mascot"
            className="absolute top-60 left-120 w-64 h-48 object-contain z-10 animate-mascot"
          />

          {/* Bottom right decorative image */}
          <img
            src="/right-robo.png"
            alt="Robot Mascot"
            className="absolute bottom-10 right-100 w-100 h-150 object-contain z-10 animate-mascot"
          />

          {/* Completion glass scoreboard */}
          <div className="w-150 h-[600px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative">
            {/* Game icon */}
            <motion.img
              src="/circuit samshers logo 1.png"
              alt="Route Seekers"
              className="w-96 h-56 object-contain mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />

            {/* Game name */}
            <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
              Route Seekers
            </div>

            {/* Status message */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-3xl font-bold text-green-400 mb-2">
                Well Done!
              </h3>
              <p className="text-xl text-white/80">
                {questionnaireCompleted && networkCompleted
                  ? "You've completed both activities and earned full marks!"
                  : "You've completed one activity. Submit both for full marks next time!"}
              </p>
            </motion.div>

            {/* Activity status */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mb-8">
              <div className="bg-purple-900/30 rounded-md p-4 text-center">
                <h4 className="text-lg font-semibold text-white mb-2">Questionnaire</h4>
                <p className={questionnaireCompleted ? "text-green-400" : "text-red-400"}>
                  {questionnaireCompleted ? "Completed" : "Not Completed"}
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-md p-4 text-center">
                <h4 className="text-lg font-semibold text-white mb-2">Network Diagram</h4>
                <p className={networkCompleted ? "text-green-400" : "text-red-400"}>
                  {networkCompleted ? "Completed" : "Not Completed"}
                </p>
                {uploadedFile && <p className="text-white/70 text-sm mt-1">File: {uploadedFile.name}</p>}
              </div>
            </div>

            {/* Road Map button with map icon */}
            <motion.button
              className="px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => window.location.href = "/student/games-roadmap"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Road Map
            </motion.button>
          </div>
        </div>
      ) : !activity ? (
        <ActivitySelection
          setActivity={handleSetActivity}
          questionnaireCompleted={questionnaireCompleted}
          networkCompleted={networkCompleted}
          cardVariants={cardVariants}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <AnimatePresence>
            {showTimeWarning && (
              <motion.div
                className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-violet-900/80 px-6 py-3 rounded-lg border border-violet-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-violet-200 font-medium">
                    {timeRemaining <= 60
                      ? "Only 1 minute remaining!"
                      : `${Math.floor(timeRemaining / 60)} minutes remaining!`}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="absolute top-4 left-4 text-white flex items-center"
            onClick={() => setActivity(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Activities
          </button>

          {activity === 'questionnaire' ? (
            <QuestionnaireActivity
              questions={questions}
              answers={answers}
              handleAnswerChange={handleAnswerChange}
              questionnaireCompleted={questionnaireCompleted}
              handleSubmitQuestionnaire={handleSubmitQuestionnaire}
              networkCompleted={networkCompleted}
              pdfContainerVariants={pdfContainerVariants}
              setShowResourcesModal={setShowResourcesModal}
            />
          ) : (
            <>
              {/* Network Diagram specific UI */}
              <div className="absolute top-32 left-110 flex space-x-3 z-10">
                <motion.button
                  className="w-36 h-9 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  disabled={timeIsUp}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload File
                </motion.button>

                {uploadedFile && (
                  <div className="w-36 h-9 relative">
                    <div className="w-36 h-9 left-0 top-0 absolute bg-white/0 rounded-[3px] border border-white" />
                    <motion.button
                      className="w-36 h-9 absolute top-0 left-0 text-white font-medium flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setUploadedFile(null);
                        setIsFileValid(false);
                      }}
                      disabled={timeIsUp}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </motion.button>
                  </div>
                )}
              </div>
              {pdfUrl ? (
                <PdfViewer pdfUrl={pdfUrl} />
              ) : (
                <div className="flex items-center justify-center w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px]">
                  <p className="text-white">{pdfError || 'Loading Network Design...'}</p>
                </div>
              )}
            </>
          )}

          {/* Common Timer UI */}
          <div className="h-6"></div>
          <motion.div
            className="mt-4 mb-4 w-[720px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-full bg-gray-700/30 rounded-full h-2.5 mb-3">
              <motion.div
                className={`${timeRemaining < 300 ? 'bg-violet-500' : 'bg-violet-900'
                  } h-2.5 rounded-full`}
                initial={{ width: "100%" }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center w-full mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-mono font-medium ${timeRemaining < 60 ? 'text-red-400 animate-pulse' :
                timeRemaining < 300 ? 'text-violet-300' :
                  'text-white/80'
                }`}>
                Time remaining: {formatTime(timeRemaining)}
              </span>
              {uploadedFile && (
                <span className="ml-4 bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs border border-green-500/30">
                  File uploaded: {uploadedFile.name}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showNextActivityPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 border border-blue-500 p-8 rounded-lg text-center shadow-xl text-white">
              <h2 className="text-3xl font-bold mb-4 text-blue-400">
                Next Activity: Network Diagram
              </h2>
              <p className="mb-6 text-gray-300">
                Well done! Get ready for the next challenge.
              </p>
              <button
                onClick={() => {
                  setActivity('network');
                  setShowNextActivityPopup(false);
                  setCountdown(5);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 font-semibold shadow-lg transform hover:scale-105"
              >
                Go to Network Diagram ({countdown})
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Automatically proceeding in {countdown} seconds...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals for file upload and resources */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="bg-stone-900/90 rounded-lg border border-white/10 p-6 max-w-md w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Upload Network Design Solution</h3>
              <p className="text-white/70 mb-4">Please upload your solution:</p>
              <ul className="text-white/70 mb-6 list-disc list-inside space-y-1 text-sm">
                <li>For multiple files, create a .zip archive</li>
                <li>Files with the same name will be overwritten</li>
              </ul>

              <div className="mb-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".zip"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 bg-stone-800/50 border-2 border-dashed border-violet-500/30 rounded-lg cursor-pointer hover:bg-stone-800/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-violet-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-violet-300">Click to select a file</span>
                  <span className="text-xs text-violet-400/70 mt-1">(.zip files only)</span>
                </label>
              </div>

              {uploadedFile && (
                <div className="mb-6 p-3 bg-stone-800/50 rounded border border-stone-700/50">
                  <p className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {uploadedFile.name}
                    {!isFileValid && (
                      <span className="ml-auto text-red-400 text-sm">
                        Invalid file type (must be .zip)
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-600 transition-colors"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded ${isFileValid
                    ? 'bg-violet-700 text-white hover:bg-violet-600'
                    : 'bg-violet-900/40 text-white/50 cursor-not-allowed'} transition-colors`}
                  onClick={handleNetworkDesignUpload}
                  disabled={!isFileValid}
                >
                  Save File
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources modal */}
      <AnimatePresence>
        {showResourcesModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResourcesModal(false)}
          >
            <motion.div
              className="bg-stone-900/90 rounded-lg border border-white/10 p-6 max-w-md w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Download Resources</h3>
              <p className="text-white/70 mb-6">The following resources are available to help you complete this networking challenge:</p>

              <div className="mb-6 space-y-2">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <div key={resource._id} className="flex justify-between items-center p-3 bg-stone-800/50 rounded border border-stone-700/50 hover:bg-stone-700/50 transition-colors">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-white">{resource.originalname}</span>
                      </div>
                      <div className="flex items-center">
                        <button onClick={() => handleDownload(resource._id, resource.originalname)} className="p-1 bg-violet-700/50 hover:bg-violet-700 rounded transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70 text-center">No resources available for download.</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-600 transition-colors"
                  onClick={() => setShowResourcesModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}