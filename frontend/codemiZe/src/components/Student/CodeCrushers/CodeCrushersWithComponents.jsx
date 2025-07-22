import React, { useState, useEffect, useRef } from 'react';
import GameLayout from '../GameLayout/GameLayout';
import StartScreen from '../../../components/Student/CodeCrushers/StartScreen';
import GameCompletedScreen from '../../../components/Student/CodeCrushers/GameCompletedScreen';
import ActiveGameScreen from '../../../components/Student/CodeCrushers/ActiveGameScreen';
import UploadModal from '../../../components/Student/CodeCrushers/UploadModal';
import TimeWarningPopup from '../../../components/Student/CodeCrushers/TimeWarningPopup';
import TimesUpPopup from '../../../components/Student/CodeCrushers/TimesUpPopup';

export default function CodeCrushersWithComponents() {
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // PDF viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Set to actual number of PDF pages

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

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
    if (file && file.name.endsWith('.py')) {
      setUploadedFile(file);
      setIsFileValid(true);
    } else {
      setUploadedFile(file);
      setIsFileValid(false);
    }
  };

  const handleSubmitCode = () => {
    if (isFileValid) {
      setGameCompleted(true);
      setShowUploadModal(false);
    }
  };

  // Game end handler (time's up)
  const handleGameEnd = () => {
    // Handle game end logic
    if (isFileValid) {
      setGameCompleted(true);
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

  // Function to close the upload modal
  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  // Function to continue after time's up
  const handleContinueAfterTimeUp = () => {
    setTimeIsUp(false);
  };

  return (
    <GameLayout>
      {!isGameStarted ? (
        <StartScreen
          handleStartGame={handleStartGame}
          isLoading={isLoading}
        />
      ) : gameCompleted ? (
        <GameCompletedScreen
          uploadedFile={uploadedFile}
        />
      ) : (
        <>
          <TimeWarningPopup
            show={showTimeWarning}
            timeRemaining={timeRemaining}
          />

          <TimesUpPopup
            show={timeIsUp && !gameCompleted}
            isFileValid={isFileValid}
            onContinue={handleContinueAfterTimeUp}
            onSubmit={handleSubmitCode}
          />

          <UploadModal
            show={showUploadModal}
            onClose={closeUploadModal}
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            isFileValid={isFileValid}
            onSubmit={handleSubmitCode}
            fileInputRef={fileInputRef}
          />

          <ActiveGameScreen
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            timeRemaining={timeRemaining}
            calculateProgress={calculateProgress}
            formatTime={formatTime}
            setShowUploadModal={setShowUploadModal}
          />
        </>
      )}
    </GameLayout>
  );
}
