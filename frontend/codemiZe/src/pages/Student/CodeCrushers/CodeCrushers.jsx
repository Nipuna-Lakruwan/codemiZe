import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import GameNodeMini from '../../../components/Games/GameNodeMini';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import { imagePath } from '../../../utils/helper';
import PdfViewer from '../../../components/Student/PDFViewer/PdfViewer';
import { SocketContext } from '../../../context/SocketContext';

export default function CodeCrushers() {
  const socket = useContext(SocketContext);
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // PDF viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFullscreenPdf, setShowFullscreenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(); // Add your PDF path here
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [isServerTimerActive, setIsServerTimerActive] = useState(false); // Track if server timer is active

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getSlides = async () => {
      const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_SLIDES);
      setPdfUrl(imagePath(response.data.slides[0].slides[0]));
    };
    getSlides();
  }, []);

  // Listen for messages from popup window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'prevPage') {
        if (currentPage > 1) {
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          // Update the popup
          if (event.source) {
            event.source.postMessage({
              action: 'updatePage',
              page: newPage,
              totalPages
            }, '*');
          }
        }
      } else if (event.data.action === 'nextPage') {
        if (currentPage < totalPages) {
          const newPage = currentPage + 1;
          setCurrentPage(newPage);
          // Update the popup
          if (event.source) {
            event.source.postMessage({
              action: 'updatePage',
              page: newPage,
              totalPages
            }, '*');
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentPage, totalPages]);

  // Timer effect - handles server synchronization only
  useEffect(() => {
    if (socket) {
      socket.on('codeCrushers-roundStarted', (data) => {
        console.log('Round started from server:', data);
        if (data.allocatedTime) {
          setTimeRemaining(data.allocatedTime);
          setIsGameStarted(true);
          setGameCompleted(false);
          setTimeIsUp(false);
          setIsServerTimerActive(true);
        }
      });

      // Listen for server timer updates
      socket.on('codeCrushers-timerUpdate', (data) => {
        setTimeRemaining(data.timeRemaining);
        setIsServerTimerActive(true);

        if (data.timeRemaining === 5 * 60) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 5000);
        } else if (data.timeRemaining === 60) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 5000);
        }
      });

      // Listen for time up event from server
      socket.on('codeCrushers-timeUp', (data) => {
        setTimeRemaining(0);
        setTimeIsUp(true);
        setIsServerTimerActive(false);
        handleGameEnd();
      });

      // Listen for timer stopped event from server
      socket.on('codeCrushers-timerStopped', (data) => {
        setTimeRemaining(0);
        setTimeIsUp(true);
        setIsServerTimerActive(false);
        handleGameEnd();
      });

      // Listen for timer paused event from server
      socket.on('codeCrushers-roundPaused', (data) => {
      });

      // Listen for timer resumed event from server
      socket.on('codeCrushers-roundResumed', (data) => {
      });

      // Listen for sync timer event (for reconnection)
      socket.on('codeCrushers-syncTimer', (data) => {
        if (data.timeRemaining !== undefined) {
          setTimeRemaining(data.timeRemaining);
          setIsGameStarted(data.isReconnect || false);
          setIsServerTimerActive(data.timeRemaining > 0);
        }
      });

      // Request current state when component mounts (for reconnection)
      socket.emit('codeCrushers-requestCurrentState');
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.off('codeCrushers-roundStarted');
        socket.off('codeCrushers-timerUpdate');
        socket.off('codeCrushers-timeUp');
        socket.off('codeCrushers-timerStopped');
        socket.off('codeCrushers-roundPaused');
        socket.off('codeCrushers-roundResumed');
        socket.off('codeCrushers-syncTimer');
      }
    };
  }, [socket]);

  // Start game handler
  const handleStartGame = () => {
    if (!isServerTimerActive) {
      console.log('Cannot start game: Server timer is not active');
      return; // Prevent game start if server timer is not active
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsGameStarted(true);
      setIsLoading(false);
    }, 1500);
  };

  // Page navigation handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

    // PDF handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setTotalPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError(`Failed to load PDF: ${error.message || 'Unknown error'}`);
    setPdfLoading(false);
  };

  const onPageLoadError = (error) => {
    console.error('Error loading PDF page:', error);
    setPdfError(`Failed to load page: ${error.message || 'Unknown error'}`);
  };

  // File upload handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // Check if it's a Python file or a zip file (for multiple files)
    if (file) {
      if (file.name.endsWith('.py')) {
        setUploadedFile(file);
        setIsFileValid(true);
      } else if (file.name.endsWith('.zip')) {
        setUploadedFile(file);
        setIsFileValid(true);
      } else {
        setUploadedFile(file);
        setIsFileValid(false);
      }
    }
  };

  const handleSubmitCode = () => {
    if (isFileValid) {
      setGameCompleted(true);
    }
  };

  // Game end handler (time's up)
  const handleGameEnd = () => {
    // Show the time's up modal but don't auto-submit
    // The user will see their file status and can proceed to results if a file is uploaded
    // Otherwise, they'll have one last chance to upload a file

    // After a reasonable delay to let the user respond, proceed with auto-submission
    // if they haven't taken action
    if (isFileValid && uploadedFile) {
      // Set a longer timeout to auto-submit if the user doesn't click "View Results"
      setTimeout(() => {
        // Only auto-submit if the time's up modal is still showing (user hasn't clicked)
        if (timeIsUp && !gameCompleted) {
          setGameCompleted(true);
        }
      }, 15000); // 15 seconds delay
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
    return (timeRemaining / (30 * 60)) * 100;
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

  const iconVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
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

  const uploadButtonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 10px rgba(140, 20, 252, 0.7)",
      transition: {
        duration: 0.2
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

  return (
    <GameLayout gameName={isGameStarted && !gameCompleted ? "Code Crushers" : ""}>
      {!isGameStarted ? (
        <StartGameComponent
          title="Code Crushers"
          iconSrc="/code crushers logo 1.png"
          iconAlt="Code Crushers"
          onStart={handleStartGame}
          isLoading={isLoading}
          topRightImageSrc="/robo1.png"
          bottomLeftImageSrc="/robo2.png"
          showScoreInfo={false}
          isDisabled={!isServerTimerActive}
          buttonText={!isServerTimerActive ? "Waiting..." : "Start Game"}
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
              src="/code crushers logo 1.png"
              alt="Code Crushers"
              className="w-96 h-56 object-contain mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />

            {/* Game name */}
            <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
              Code Crushers
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
                Your code has been successfully submitted!
              </p>
            </motion.div>

            {/* File name display */}
            {uploadedFile && (
              <motion.div
                className="bg-purple-900/30 border border-purple-500/30 rounded-md p-4 mb-8 w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white text-center">
                  <span className="font-medium">Submitted file:</span> {uploadedFile.name}
                </p>
              </motion.div>
            )}

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
      ) : (
        // Active game screen with PDF viewer
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {/* Time warning popup */}
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

          {/* Time's up popup */}
          <AnimatePresence>
            {timeIsUp && !gameCompleted && (
              <motion.div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="bg-red-900/80 px-8 py-6 rounded-lg border border-red-500/30 max-w-md text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-3xl font-bold text-red-100 mb-2">Time's Up!</h2>
                  <p className="text-red-200 mb-6">
                    {uploadedFile
                      ? `Your uploaded file "${uploadedFile.name}" will be submitted.`
                      : "Time's up! You haven't uploaded any file yet."}
                  </p>
                  <div className="flex space-x-4 justify-center">
                    {uploadedFile ? (
                      <motion.button
                        className="px-6 py-2 bg-green-800 text-white rounded-md border border-green-600/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmitCode}
                      >
                        View Results
                      </motion.button>
                    ) : (
                      <motion.button
                        className="px-6 py-2 bg-amber-800 text-white rounded-md border border-amber-600/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setTimeIsUp(false);
                          setShowUploadModal(true);
                        }}
                      >
                        Upload File
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File upload modal */}
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
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Python Code</h3>
                  <p className="text-white/70 mb-4">Please upload your solution:</p>
                  <ul className="text-white/70 mb-6 list-disc list-inside space-y-1 text-sm">
                    <li>Upload a single .py file directly</li>
                    <li>For multiple files, create a .zip archive</li>
                    <li>Files with the same name will be overwritten</li>
                  </ul>

                  <div className="mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".py,.zip"
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
                      <span className="text-xs text-violet-400/70 mt-1">(Python .py or .zip files)</span>
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
                            Invalid file type (must be .py)
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
                      onClick={() => {
                        // Just close the modal and keep the file - don't submit until time's up
                        if (isFileValid) {
                          setShowUploadModal(false);
                        }
                      }}
                      disabled={!isFileValid}
                    >
                      Save File
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game node mini in the bottom left corner - only shown during active game */}
          {!gameCompleted && (
            <div className="absolute bottom-8 left-8 z-10">
              <GameNodeMini
                title="Code Crushers"
                icon="/code crushers logo 1.png"
                linkTo="/student/games-roadmap"
              />
            </div>
          )}

          {/* File upload buttons positioned at the top left outside the box */}
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

          <PdfViewer pdfUrl={pdfUrl} />

          {/* Spacer between PDF viewer and progress bar */}
          <div className="h-6"></div>

          {/* Progress bar for timer */}
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
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Time remaining display */}
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

          {/* Fullscreen PDF Modal */}
          <AnimatePresence>
            {showFullscreenPdf && (
              <motion.div
                className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-full flex justify-between items-center p-4 bg-gray-900/80 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Code Crushers - Problem Statement</h2>
                  <button
                    className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
                    onClick={() => setShowFullscreenPdf(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-grow w-full overflow-auto p-8 flex items-center justify-center">
                  <div className="w-full max-w-5xl h-[80vh] bg-zinc-300 rounded-md flex items-center justify-center">
                    {pdfLoading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-semibold text-xl">Loading PDF...</p>
                      </div>
                    ) : pdfError ? (
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 font-semibold text-xl mb-2">Error loading PDF</p>
                        <p className="text-gray-500">{pdfError}</p>
                      </div>
                    ) : (
                      <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                      >
                        <Page
                          pageNumber={currentPage}
                          onLoadError={onPageLoadError}
                          width={Math.min(window.innerWidth * 0.8, 1200)} // Responsive width for fullscreen
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-center space-x-8 p-4 bg-gray-900/80 border-t border-gray-700">
                  <button
                    className={`px-6 py-3 rounded-md ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous Page
                  </button>

                  <div className="text-white/80 flex items-center text-xl">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    className={`px-6 py-3 rounded-md ${currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next Page
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </GameLayout>
  );
}