import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import GameNodeMini from '../../../components/Games/GameNodeMini';

export default function RouteSeekers() {
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // PDF viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Set to actual number of PDF pages
  const [showFullscreenPDF, setShowFullscreenPDF] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const fileInputRef = useRef(null);

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

  // Timer effect
  useEffect(() => {
    let timer;
    if (isGameStarted && !gameCompleted && !timeIsUp && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          // Show warning when 5 minutes remain
          if (prev === 5 * 60) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 5000);
          }
          // Show warning when 1 minute remains
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

  // Start game handler
  const handleStartGame = () => {
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

  // File upload handlers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.pkt') || file.name.endsWith('.zip'))) {
      setUploadedFile(file);
      setIsFileValid(true);
    } else {
      setUploadedFile(file);
      setIsFileValid(false);
    }
  };

  const handleSubmitPacketTracer = () => {
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
    return (timeRemaining / (45 * 60)) * 100;
  };

  // Available resources for download
  const resources = [
    { name: "Network Topology Guide.pdf", size: "1.2 MB", url: "#" },
    { name: "IP Address Scheme.xlsx", size: "0.5 MB", url: "#" },
    { name: "Router Configuration Reference.pdf", size: "2.1 MB", url: "#" },
    { name: "Packet Tracer Starter Template.pkt", size: "3.4 MB", url: "#" },
    { name: "Network Requirements Document.pdf", size: "1.8 MB", url: "#" },
  ];

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
    <GameLayout gameName={isGameStarted && !gameCompleted ? "Route Seekers" : ""}>
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
                Your Packet Tracer network solution has been successfully submitted!
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
                        onClick={handleSubmitPacketTracer}
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
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Packet Tracer Solution</h3>
                  <p className="text-white/70 mb-4">Please upload your solution:</p>
                  <ul className="text-white/70 mb-6 list-disc list-inside space-y-1 text-sm">
                    <li>Upload a single .pkt file directly</li>
                    <li>For multiple files, create a .zip archive</li>
                    <li>Files with the same name will be overwritten</li>
                  </ul>

                  <div className="mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pkt,.zip"
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
                      <span className="text-xs text-violet-400/70 mt-1">(Packet Tracer .pkt or .zip files only)</span>
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
                            Invalid file type (must be .pkt or .zip)
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
                    {resources.map((resource, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-stone-800/50 rounded border border-stone-700/50 hover:bg-stone-700/50 transition-colors">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-white">{resource.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white/50 text-sm mr-3">{resource.size}</span>
                          <button className="p-1 bg-violet-700/50 hover:bg-violet-700 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
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

          {/* Fullscreen PDF Modal */}
          <AnimatePresence>
            {showFullscreenPDF && (
              <motion.div
                className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-full flex justify-between items-center p-4 bg-gray-900/80 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Route Seekers - Network Challenge</h2>
                  <button
                    className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
                    onClick={() => setShowFullscreenPDF(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-grow w-full overflow-auto p-8 flex items-center justify-center">
                  <div className="w-full max-w-5xl h-[80vh] bg-zinc-300 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl text-gray-600 font-semibold">Network Topology Challenge (Fullscreen)</p>
                      <p className="text-gray-500 text-xl">Page {currentPage} of {totalPages}</p>
                      <p className="text-gray-400 mt-4">Network scenario and requirements would appear here</p>
                    </div>
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

          {/* Game node mini in the bottom left corner - only shown during active game */}
          {!gameCompleted && (
            <div className="absolute bottom-8 left-8 z-10">
              <GameNodeMini
                title="Route Seekers"
                icon="/circuit samshers logo 1.png"
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

          {/* Main PDF viewer container */}
          <motion.div
            className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative"
            variants={pdfContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Download Resources Button (positioned at the bottom left inside transparent box) */}
            <div className="absolute bottom-6 left-6 z-10">
              <motion.button
                className="w-56 h-9 bg-sky-600 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center gap-1"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(14, 165, 233, 0.6)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowResourcesModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resources
              </motion.button>
            </div>

            {/* PDF content area with fullscreen option */}
            <div className="w-[973px] h-[466px] bg-zinc-300 rounded-md flex flex-col relative mb-4">
              {/* PDF Viewer Controls - Top right */}
              <div className="absolute top-2 right-2 flex space-x-2 z-10">
                <button
                  className="bg-violet-800/80 hover:bg-violet-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  onClick={() => {
                    // Open a new window/tab with the PDF viewer
                    const pdfWindow = window.open('', '_blank');
                    pdfWindow.document.write(`
                      <html>
                        <head>
                          <title>Route Seekers - Network Challenge</title>
                          <style>
                            body { 
                              margin: 0; 
                              padding: 0; 
                              background-color: #1e1e1e;
                              color: white;
                              font-family: Arial, sans-serif;
                              overflow: hidden;
                            }
                            .pdf-container {
                              display: flex;
                              flex-direction: column;
                              height: 100vh;
                              padding: 16px;
                            }
                            .header {
                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                              margin-bottom: 16px;
                            }
                            .pdf-content {
                              background-color: #d4d4d8;
                              border-radius: 8px;
                              flex-grow: 1;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 16px;
                            }
                            .footer {
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              gap: 24px;
                            }
                            .nav-button {
                              background-color: #6d28d9;
                              color: white;
                              border: none;
                              border-radius: 4px;
                              padding: 8px 16px;
                              cursor: pointer;
                            }
                            .nav-button:disabled {
                              background-color: #71717a;
                              cursor: not-allowed;
                            }
                            .nav-button:hover:not(:disabled) {
                              background-color: #7c3aed;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="pdf-container">
                            <div class="header">
                              <h1>Route Seekers - Network Challenge</h1>
                              <span>Page ${currentPage} of ${totalPages}</span>
                            </div>
                            <div class="pdf-content">
                              <div class="text-center">
                                <p style="font-size: 24px; color: #4b5563; font-weight: 600;">Network Topology Challenge</p>
                                <p style="color: #6b7280;">Page ${currentPage} of ${totalPages}</p>
                                <p style="font-size: 14px; color: #9ca3af; margin-top: 16px;">Network scenario and requirements would appear here</p>
                              </div>
                            </div>
                            <div class="footer">
                              <button class="nav-button" onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                              <span>Page ${currentPage} of ${totalPages}</span>
                              <button class="nav-button" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                            </div>
                          </div>
                          <script>
                            function prevPage() {
                              window.opener.postMessage({ action: 'prevPage' }, '*');
                            }
                            function nextPage() {
                              window.opener.postMessage({ action: 'nextPage' }, '*');
                            }
                            // Listen for page updates from parent window
                            window.addEventListener('message', (event) => {
                              if (event.data.action === 'updatePage') {
                                document.querySelectorAll('.footer span, .header span').forEach(el => {
                                  el.textContent = 'Page ' + event.data.page + ' of ' + event.data.totalPages;
                                });
                              }
                            });
                          </script>
                        </body>
                      </html>
                    `);
                    pdfWindow.document.close();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in New Tab
                </button>
                <button
                  className="bg-violet-800/80 hover:bg-violet-700 text-white px-3 py-1 rounded flex items-center text-sm"
                  onClick={() => setShowFullscreenPDF(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  Fullscreen
                </button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl text-gray-600 font-semibold">Network Topology Challenge</p>
                  <p className="text-gray-500">Page {currentPage} of {totalPages}</p>
                  <p className="text-sm text-gray-400 mt-4">Network scenario and requirements would appear here</p>
                  {/* This would be an embedded PDF viewer in a real implementation */}
                </div>
              </div>
            </div>

            {/* Page navigation controls */}
            <div className="flex items-center justify-center space-x-6">
              <button
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Back
              </button>

              <div className="text-white/80">
                Page {currentPage} of {totalPages}
              </div>

              <button
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </motion.div>

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
                transition={{ duration: 0.5 }}
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

          {/* Time remaining display positioned at the bottom */}
        </div>
      )}
    </GameLayout>
  );
}