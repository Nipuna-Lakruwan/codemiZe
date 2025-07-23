import React, { useState, useEffect } from 'react';
// Framer Motion removed to fix animation warnings
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import GameNodeMini from '../../../components/Games/GameNodeMini';

// Add custom CSS animations
import './quizHuntersAnimations.css';

export default function QuizHunters() {
  // Sample quiz questions - moved to the top before state initialization
  const quizQuestions = [
    // Sample quiz questions as fallback if API fails
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

  // Add an effect to synchronize selectedAnswer with userAnswers when currentQuestionIndex changes
  useEffect(() => {
    // Make sure the selected answer matches the user's saved answer for this question
    setSelectedAnswer(userAnswers[currentQuestionIndex]);
  }, [currentQuestionIndex, userAnswers]);

  // Function to handle the end of quiz (time up or completion)
  const handleQuizEnd = () => {
    // Calculate score based on answers
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

      // Make sure selected answer is consistent with userAnswers
      const initialAnswers = Array(quizQuestions.length).fill(null);
      setUserAnswers(initialAnswers);
      setSelectedAnswer(initialAnswers[0]);
    }, 1500);
  };

  // CSS classes will be used instead of Framer Motion animations
  // This avoids issues with non-animatable color formats

  // Define some animation durations for consistency
  const transitionDurations = {
    fast: 200,
    medium: 300,
    slow: 500
  };

  // Handler for answer selection with simplified logic
  // Note: We're only implementing frontend functionality here.
  // The backend will handle validation and scoring of answers.
  const handleAnswerSelect = (index) => {
    if (timeIsUp) return; // Prevent selecting answer when time is up

    // Get current answer selection
    const currentSelectedAnswer = userAnswers[currentQuestionIndex];

    // Create new answers array
    const newUserAnswers = [...userAnswers];

    // Handle toggle functionality (clicking the same answer)
    if (currentSelectedAnswer === index) {
      // If clicking the same answer, toggle it off
      newUserAnswers[currentQuestionIndex] = null;

      // If the deselected answer was correct, decrease score
      if (index === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prevScore => prevScore - 1);
      }

      // Update state
      setUserAnswers(newUserAnswers);
      setSelectedAnswer(null);
    } else {
      // If selecting a different answer

      // If a different answer was previously selected and it was correct, decrease score
      if (currentSelectedAnswer !== null &&
        currentSelectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prevScore => prevScore - 1);
      }

      // Update the new answer
      newUserAnswers[currentQuestionIndex] = index;

      // If new answer is correct, increase score
      if (index === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prevScore => prevScore + 1);
      }

      // Update state
      setUserAnswers(newUserAnswers);
      setSelectedAnswer(index);
    }

    // Provide brief feedback
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 800);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;

      // First update the selected answer to match the next question's saved answer
      // This ensures we don't have a mismatch between userAnswers and selectedAnswer
      const nextAnswer = userAnswers[nextIndex];

      // Update the question index and other state
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(nextAnswer); // Will be null if no answer is selected
      setShowFeedback(false);

      // Debug info
      console.log('Moving to question', nextIndex, 'with selected answer:', nextAnswer);
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

  // Calculate progress percentage - now based on remaining time
  const calculateProgress = () => {
    // Calculate as percentage of total time (30 minutes)
    const totalTime = 30 * 60; // 30 minutes in seconds
    return (timeRemaining / totalTime) * 100;
  };

  const progressPercentage = calculateProgress();

  // Helper function to get current question
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
    <GameLayout gameName={isGameStarted && !quizEnded ? "Quiz Hunters" : ""}>
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
            <img
              src="/quiz_hunters_logo-removebg 1.png"
              alt="Quiz Hunters"
              className="w-96 h-56 object-contain mb-4 animate-scale-in"
            />

            {/* Game name */}
            <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
              Quiz Hunters
            </div>

            {/* Status message */}
            <div
              className="text-center mb-4 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-xl font-medium text-white/80">
                {timeIsUp ? "Time's Up!" : "Quiz Completed!"}
              </h3>
            </div>

            {/* Score title and value */}
            <div
              className="text-center mb-8 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-xl font-medium text-white/90 mb-1">Score</h3>
              <div className="text-5xl font-bold text-purple-400">
                {finalScore} / {quizQuestions.length}
              </div>
            </div>

            {/* Road Map button with map icon */}
            <button
              className="px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-[0px_0px_8px_rgba(140,20,252,0.6)] active:scale-95 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
              onClick={() => window.location.href = "/student/games-roadmap"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Road Map
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
          {/*</svg> Time warning popup */}
          {showTimeWarning && (
            <div
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-amber-900/80 px-6 py-3 rounded-lg border border-amber-500/30 backdrop-blur-sm animate-slide-in-top"
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
            </div>
          )}

          {/* Time's up popup */}
          {timeIsUp && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm animate-fade-in"
            >
              <div
                className="bg-red-900/80 px-8 py-6 rounded-lg border border-red-500/30 max-w-md text-center animate-scale-in"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold text-red-100 mb-2">Time's Up!</h2>
                <p className="text-red-200 mb-6">Your answers have been submitted.</p>
                <button
                  className="px-6 py-2 bg-red-800 text-white rounded-md border border-red-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setTimeIsUp(false)}
                >
                  View Results
                </button>
              </div>
            </div>
          )}

          {/* Question container */}
          <div
            key={`question-container-${currentQuestionIndex}`}
            className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] p-8 flex flex-col transition-opacity duration-300 ease-out opacity-100"
          >
            {/* Question box with enhanced styling */}
            <div
              className="w-[973px] h-36 bg-zinc-200 rounded-md mb-6 overflow-hidden flex transition-all duration-300 ease-out shadow-lg border border-gray-300/50"
            >
              <div className="p-6 flex items-center w-full">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-violet-600 text-white flex items-center justify-center mr-4 shadow-md">
                  <span className="font-bold">{currentQuestionIndex + 1}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-gray-800">
                  {getCurrentQuestion().question}
                </h3>
              </div>
            </div>

            {/* Answer choices */}
            <div className="space-y-4 mb-auto flex-grow">
              {getCurrentQuestion().options.map((option, index) => {
                // Determine if this answer is currently selected
                const isSelected = userAnswers[currentQuestionIndex] === index;

                return (
                  <div
                    key={`answer-${index}`}
                    id={`answer-option-${index}`}
                    className={`w-[973px] h-16 bg-white rounded-md 
                        ${isSelected
                        ? "border-l-[15px] border-violet-500 shadow-[0_0_0_2px_rgba(139,92,246,0.5),0_0_15px_rgba(139,92,246,0.35)] bg-violet-50"
                        : "border-l-[15px] border-violet-900"
                      } cursor-pointer overflow-hidden transition-all duration-200 ease-out
                        ${timeIsUp ? 'pointer-events-none opacity-70' : ''}
                        hover:scale-[1.01] hover:bg-gray-50 hover:shadow-md active:scale-[0.99]`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="p-4 flex items-center h-full relative z-10">
                      {/* Letter indicator without animations */}
                      <div
                        className={`w-8 h-8 flex-shrink-0 rounded-full border-2 
                            ${isSelected
                            ? "border-violet-500 bg-violet-100 text-violet-800"
                            : "border-gray-500 bg-gray-100"
                          } flex items-center justify-center mr-4 transition-all duration-200`}
                      >
                        <span className={`font-medium ${isSelected ? "text-violet-800" : "text-gray-700"}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>

                      {/* Answer text */}
                      <span
                        className={`text-lg ${isSelected ? "text-violet-900 font-medium" : "text-gray-800"} transition-all duration-200`}
                      >
                        {option}
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Question counter and next button */}
            <div className="flex items-center justify-between mt-2 relative">
              <div className="text-white/80 text-lg font-medium opacity-0">
                Question {currentQuestionIndex + 1}/{quizQuestions.length}
              </div>

              {/* Centered Question counter - enhanced styling */}
              <div className="absolute left-1/2 transform -translate-x-1/2 text-white/95 text-2xl font-bold bg-gray-800/40 px-6 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-lg">
                Question {currentQuestionIndex + 1}/{quizQuestions.length}
              </div>

              {/* Warning tooltip - replaced AnimatePresence with conditional rendering */}
              {showWarning && (
                <div
                  className="absolute -top-14 right-0 bg-amber-800/90 text-white text-sm py-2 px-4 rounded-md shadow-lg border border-amber-600/50 animate-fade-in"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Please select an answer first
                  </div>
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-amber-800/90 transform rotate-45"></div>
                </div>
              )}
              {/* Next button with conditional styling */}
              <button
                className={`px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium 
                    ${(userAnswers[currentQuestionIndex] === null || timeIsUp) ? 'opacity-50 cursor-not-allowed' : ''}
                    transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95`}
                onClick={userAnswers[currentQuestionIndex] !== null && !timeIsUp ?
                  handleNextQuestion : handleAttemptNextWithoutAnswer}
              >
                {currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>

          {/* Spacer between question box and progress/timer */}
          <div className="h-8" />

          {/* Progress bar synced with remaining time */}
          <div
            className="mt-4 mb-4 w-[723px] animate-fade-in"
            key="progress-bar"
          >
            <div className="w-full bg-zinc-300 rounded-2xl h-2.5 mb-3 shadow-inner overflow-hidden">
              <div
                className={`${timeRemaining < 300 ? 'bg-amber-500' : 'bg-violet-600'} h-full rounded-2xl transition-all duration-500 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]`}
                style={{ width: `${(timeRemaining / (30 * 60)) * 100}%` }}
              />
            </div>
          </div>

          {/* Time remaining - centered under the progress bar */}
          <div
            className="flex justify-center w-full animate-fade-in"
            key="timer"
          >
            <div className="flex items-center px-5 py-1.5 bg-gray-800/60 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-mono font-medium ${timeRemaining < 60 ? 'text-red-400 animate-pulse' :
                timeRemaining < 300 ? 'text-amber-300' :
                  'text-white/90'}`}
              >
                Time remaining: {formatTime(timeRemaining)}
              </span>
              {currentQuestionIndex === quizQuestions.length - 1 && (
                <span className="ml-4 bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs border border-green-500/30">
                  Final Question
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
}