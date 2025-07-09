import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import GameNodeMini from '../../../components/Games/GameNodeMini';

export default function QuizHunters() {
  // Sample quiz questions - moved to the top before state initialization
  const quizQuestions = [
    {
      question: "What is the correct syntax to declare a variable in JavaScript?",
      options: ["var name;", "variable name;", "v name;", "let = name;"],
      correctAnswer: 0,
    },
    {
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Object"],
      correctAnswer: 2,
    },
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
    },
    {
      question: "What is the correct way to create a function in JavaScript?",
      options: [
        "function = myFunction()",
        "function myFunction()",
        "function:myFunction()",
        "create myFunction()"
      ],
      correctAnswer: 1,
    },
    {
      question: "Which CSS property is used to change the text color of an element?",
      options: ["color", "text-color", "font-color", "foreground-color"],
      correctAnswer: 0,
    }
  ];

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Add new state variables - now quizQuestions is defined before this
  const [userAnswers, setUserAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizEnded, setQuizEnded] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);

  // Add new state for warning tooltip
  const [showWarning, setShowWarning] = useState(false);

  // Timer effect with enhanced functionality
  useEffect(() => {
    let timer;
    if (isGameStarted && !quizCompleted && !timeIsUp && timeRemaining > 0) {
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
            handleQuizEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted, quizCompleted, timeRemaining]);

  // Function to handle the end of quiz (time up or completion)
  const handleQuizEnd = () => {
    // Calculate final score based on collected answers
    const finalScore = userAnswers.reduce((score, answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);

    setFinalScore(finalScore);
    setQuizCompleted(true);
    setQuizEnded(true);
  };

  const handleStartGame = () => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsGameStarted(true);
      setIsLoading(false);
      setCurrentQuestionIndex(0);
      setScore(0);
    }, 1500);
  };

  // Enhanced answer animation variants with more user-friendly interactions
  const answerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      backgroundColor: "#f8f8f8",
      boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.3)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      backgroundColor: "#efefef",
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    },
    selected: {
      backgroundColor: "#f1ebff", // Light purple background
      borderColor: "rgba(139, 92, 246, 1)",
      boxShadow: "0px 0px 12px rgba(139, 92, 246, 0.3)",
      scale: 1.02,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Enhanced letter indicator animations with solid colors
  const letterIndicatorVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
        repeatDelay: 0.5
      }
    },
    selected: {
      scale: 1.1,
      backgroundColor: "rgba(139, 92, 246, 0.4)",
      borderColor: "rgba(139, 92, 246, 0.9)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Add new handler for answer selection
  const handleAnswerSelect = (index) => {
    if (timeIsUp) return; // Prevent selecting answer when time is up

    // Save the user's answer - keep track of the selection regardless of feedback state
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = index;
    setUserAnswers(newUserAnswers);

    setSelectedAnswer(index);
    setShowFeedback(true);

    // Check if answer is correct - but don't show it to user yet
    if (index === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Briefly show feedback but don't reset the selection
    setTimeout(() => {
      setShowFeedback(false);
      // Don't reset selectedAnswer anymore: setSelectedAnswer(null);
    }, 800); // Shorter time for better UX flow
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // End quiz if this was the last question
      handleQuizEnd();
    }
  };

  const resetQuiz = () => {
    setIsGameStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setUserAnswers(Array(quizQuestions.length).fill(null));
    setQuizCompleted(false);
    setQuizEnded(false);
    setTimeIsUp(false);
    setTimeRemaining(30 * 60);
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage - updated for more accuracy
  const calculateProgress = () => {
    // If on the last question, show 100% progress
    if (currentQuestionIndex === quizQuestions.length - 1) {
      return 100;
    }
    // Otherwise show progress relative to total questions (adjusted to show actual progress)
    return (currentQuestionIndex / (quizQuestions.length - 1)) * 100;
  };

  const progressPercentage = calculateProgress();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
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

  const getCurrentQuestion = () => {
    return quizQuestions[currentQuestionIndex];
  };

  const handleAttemptNextWithoutAnswer = () => {
    // Show warning if trying to proceed without selecting an answer
    if (userAnswers[currentQuestionIndex] === null) {
      setShowWarning(true);
      // Auto-hide warning after a delay
      setTimeout(() => setShowWarning(false), 2000);
    }
  };

  return (
    <GameLayout>
      {/* Game navigation node - only show on game screens, not on results */}
      {!quizEnded && (
        <GameNodeMini
          title="Quiz Hunters"
          icon="/quiz_hunters_logo-removebg 1.png"
          linkTo="/student/games-roadmap"
        />
      )}

      {!isGameStarted ? (
        <StartGameComponent
          title="Quiz Hunters"
          iconSrc="/quiz_hunters_logo-removebg 1.png"
          iconAlt="Quiz Hunters"
          onStart={handleStartGame}
          isLoading={isLoading}
          topRightImageSrc="/robo1.png"
          bottomLeftImageSrc="/robo2.png"
          showScoreInfo={true}
          totalQuestions={quizQuestions.length}
          // Pass information about scoring
          scoreInfo={`${quizQuestions.length} questions • ${quizQuestions.length} marks`}
        />
      ) : quizEnded ? (
        // Results screen with updated styling and layout
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

          {/* Redesigned glass scoreboard */}
          <div className="w-150 h-[600px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative">
            {/* Game icon */}
            <motion.img
              src="/quiz_hunters_logo-removebg 1.png"
              alt="Quiz Hunters"
              className="w-96 h-56 object-contain mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />

            {/* Game name */}
            <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
              Quiz Hunters
            </div>

            {/* Status message */}
            <motion.div
              className="text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-medium text-white/80">
                {timeIsUp ? "Time's Up!" : "Quiz Completed!"}
              </h3>
            </motion.div>

            {/* Score title and value */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-medium text-white/90 mb-1">Score</h3>
              <div className="text-5xl font-bold text-purple-400">
                {finalScore} / {quizQuestions.length}
              </div>
            </motion.div>

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {/*</svg> Time warning popup */}
          <AnimatePresence>
            {showTimeWarning && (
              <motion.div
                className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-amber-900/80 px-6 py-3 rounded-lg border border-amber-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-amber-200 font-medium">
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
            {timeIsUp && (
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
                  <p className="text-red-200 mb-6">Your answers have been submitted.</p>
                  <motion.button
                    className="px-6 py-2 bg-red-800 text-white rounded-md border border-red-600/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeIsUp(false)}
                  >
                    View Results
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question container with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`question-container-${currentQuestionIndex}`}
              className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] p-8 flex flex-col"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Question box with specified style */}
              <motion.div
                className="w-[973px] h-36 bg-zinc-300 rounded-md mb-6 overflow-hidden flex"
                variants={questionVariants}
              >
                <div className="p-5 flex items-center">
                  <h3 className="text-xl md:text-2xl font-medium text-gray-800">
                    {getCurrentQuestion().question}
                  </h3>
                </div>
              </motion.div>

              {/* Answer choices */}
              <div className="space-y-4 mb-auto flex-grow">
                {getCurrentQuestion().options.map((option, index) => {
                  // Determine if this answer is currently selected
                  const isSelected = userAnswers[currentQuestionIndex] === index;

                  return (
                    <motion.div
                      key={`answer-${index}`}
                      className={`w-[973px] h-16 bg-white rounded-md ${isSelected
                        ? "border-l-[15px] border-violet-500"
                        : "border-l-[15px] border-violet-900"
                        } cursor-pointer overflow-hidden ${timeIsUp ? 'pointer-events-none opacity-70' : ''}`}
                      variants={answerVariants}
                      custom={index}
                      initial="hidden"
                      animate={
                        isSelected
                          ? "selected"
                          : "visible"
                      }
                      whileHover={!timeIsUp && !isSelected ? "hover" : undefined}
                      whileTap={!timeIsUp && !isSelected ? "tap" : undefined}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="p-4 flex items-center h-full relative z-10">
                        {/* Enhanced letter indicator with animations */}
                        <motion.div
                          className={`w-8 h-8 flex-shrink-0 rounded-full border ${isSelected
                            ? "border-violet-500 bg-violet-500/20"
                            : "border-gray-700 bg-gray-600/20"
                            } flex items-center justify-center mr-4`}
                          variants={letterIndicatorVariants}
                          initial="initial"
                          whileHover={!timeIsUp && !isSelected ? "hover" : undefined}
                          animate={
                            isSelected
                              ? "selected"
                              : "initial"
                          }
                        >
                          <span className="text-gray-800 font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </motion.div>

                        {/* Answer text with subtle animation */}
                        <motion.span
                          className="text-gray-800 text-lg"
                          initial={{ opacity: 0.9 }}
                          whileHover={!timeIsUp && !isSelected ? { opacity: 1, x: 2 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          {option}
                        </motion.span>

                        {/* Always show selected indicator for the selected answer */}
                        {isSelected && (
                          <motion.div
                            className="ml-auto"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Question counter and next button */}
              <div className="flex items-center justify-between mt-2 relative">
                <div className="text-white/80 text-lg font-medium">
                  Question {currentQuestionIndex + 1}/{quizQuestions.length}
                </div>

                {/* Warning tooltip */}
                <AnimatePresence>
                  {showWarning && (
                    <motion.div
                      className="absolute -top-14 right-0 bg-amber-800/90 text-white text-sm py-2 px-4 rounded-md shadow-lg border border-amber-600/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please select an answer first
                      </div>
                      <div className="absolute -bottom-2 right-6 w-4 h-4 bg-amber-800/90 transform rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  className={`px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium 
                    ${(userAnswers[currentQuestionIndex] === null || timeIsUp) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={userAnswers[currentQuestionIndex] !== null && !timeIsUp ? "hover" : undefined}
                  whileTap={userAnswers[currentQuestionIndex] !== null && !timeIsUp ? "tap" : undefined}
                  onClick={userAnswers[currentQuestionIndex] !== null && !timeIsUp ?
                    handleNextQuestion : handleAttemptNextWithoutAnswer}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next"}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Spacer between question box and progress/timer */}
          <div className="h-8" />

          {/* Progress bar outside of AnimatePresence */}
          <motion.div
            className="mt-4 mb-4 w-[720px]"
            key="progress-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-full bg-gray-700/30 rounded-full h-2.5 mb-3">
              <motion.div
                className={`${currentQuestionIndex === quizQuestions.length - 1 ? 'bg-green-600' :
                  timeRemaining < 300 ? 'bg-amber-500' : 'bg-violet-900'} h-2.5 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Time remaining - centered under the progress bar */}
          <motion.div
            className="flex justify-center w-full"
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-mono font-medium ${timeRemaining < 60 ? 'text-red-400 animate-pulse' :
                timeRemaining < 300 ? 'text-amber-300' :
                  'text-white/80'}`}
              >
                Time remaining: {formatTime(timeRemaining)}
              </span>
              {currentQuestionIndex === quizQuestions.length - 1 && (
                <span className="ml-4 bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full text-xs border border-green-500/30">
                  Final Question
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </GameLayout>
  );
}