import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';
import GameNodeMini from '../../../components/Games/GameNodeMini';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';

export default function BattleBreakers() {
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPressedBuzzer, setIsPressedBuzzer] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // WebSocket and Auth
  const { socket, isConnected, joinGame, emitBuzzerPress } = useSocket();
  const { user } = useAuth();

  // Questions data - sample questions for the game
  const questions = [
    {
      question: "What programming language is used to build React applications?",
      answer: "JavaScript"
    },
    {
      question: "What does HTML stand for?",
      answer: "Hypertext Markup Language"
    },
    {
      question: "What does CSS stand for?",
      answer: "Cascading Style Sheets"
    },
    {
      question: "What data structure follows the LIFO principle?",
      answer: "Stack"
    },
    {
      question: "Which SQL command is used to retrieve data from a database?",
      answer: "SELECT"
    },
    {
      question: "What is the time complexity of a binary search?",
      answer: "O(log n)"
    },
    {
      question: "What does API stand for?",
      answer: "Application Programming Interface"
    },
    {
      question: "Which protocol is used to load webpages?",
      answer: "HTTP/HTTPS"
    },
    {
      question: "What is the purpose of a firewall?",
      answer: "To monitor and filter incoming and outgoing network traffic"
    },
    {
      question: "Which encryption algorithm is considered the most secure?",
      answer: "AES-256"
    }
  ];

  // Buzzer sound effect
  const buzzerSound = useRef(null);

  // Mock buzzer sound functionality
  const playBuzzerSound = () => {
    // Check if Web Audio API is available in the browser
    if (window.AudioContext || window.webkitAudioContext) {
      try {
        // Create a new audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        // Create an oscillator (tone generator)
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Connect the oscillator to the gain node, and the gain node to the destination
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Set the oscillator type and frequency for a buzzer-like sound
        oscillator.type = 'square';
        oscillator.frequency.value = 220; // A3 note

        // Set gain (volume) and fade out
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        // Start and stop the oscillator
        oscillator.start();
        setTimeout(() => oscillator.stop(), 500);
      } catch (e) {
        console.log("Error generating audio:", e);
      }
    }
  };

  useEffect(() => {
    // Try to create audio element for buzzer sound if file is available
    // In production, you would use an actual audio file:
    // buzzerSound.current = new Audio('/buzz-sound.mp3');

    // Set total questions count
    setTotalQuestionsCount(questions.length);

    // Join the game room when component mounts
    if (socket && isConnected) {
      joinGame('battle_breakers', 'student');
    }

    return () => {
      // Clean up audio when component unmounts
      if (buzzerSound.current) {
        buzzerSound.current.pause();
        buzzerSound.current = null;
      }
    };
  }, [socket, isConnected]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isGameStarted && isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Move to next question if time runs out
            handleNextQuestion();
            return 30; // Reset timer for next question
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted, isTimerRunning, timeRemaining]);

  // Start game handler
  const handleStartGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGameStarted(true);
      setIsLoading(false);
      setIsTimerRunning(true);
    }, 1500);
  };

  // Handle buzzer press
  const handleBuzzerPress = () => {
    setIsPressedBuzzer(true);
    setIsTimerRunning(false);

    // No longer showing answers as per request
    // setShowAnswer(true); 

    // Play buzzer sound using our mock function
    playBuzzerSound();

    // Emit buzzer press event through WebSocket
    if (socket && user) {
      emitBuzzerPress({
        questionNumber: currentQuestion + 1,
        school: {
          id: user.id,
          name: user.name || 'Test School', // Replace with actual school data from user
          logo: user.avatar?.url || '/scl1.png', // Use user's avatar or default
          city: user.city || 'Test City' // Replace with actual city from user
        },
        timestamp: new Date().toISOString()
      });
    }

    // Simulate buzzer press animation timing
    setTimeout(() => {
      setIsPressedBuzzer(false);

      // Auto-proceed to next question after a short delay (in future this will be handled by dashboard)
      // setTimeout(() => {
      //   handleNextQuestion();
      // }, 2000);
    }, 300);
  };

  // Move to next question
  const handleNextQuestion = () => {
    // Reset answer visibility
    setShowAnswer(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(30); // Reset timer for next question
      setIsTimerRunning(true);
    } else {
      // Game completed - handle end of game
      setIsTimerRunning(false);
      setGameCompleted(true);
    }
  };

  return (
    <GameLayout>
      {!isGameStarted ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
          {/* Top right decorative image */}
          <motion.div
            className="absolute top-4 right-8 sm:top-8 sm:right-8 md:top-12 md:right-16 lg:top-45 lg:right-130 z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <motion.img
              src="/right-robo.png"
              alt="Robot Mascot"
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-56 lg:h-44 object-contain"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Bottom left decorative image */}
          <motion.div
            className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 lg:bottom-20 lg:left-110 z-30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.9,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <motion.img
              src="/left-robo.png"
              alt="Robot Mascot"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-80 lg:h-96 object-contain"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>

          {/* Transparent glass box - with responsive sizing */}
          <motion.div
            className="w-full max-w-lg sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] h-auto aspect-[4/5] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Game Icon - responsive sizing */}
            <motion.img
              src="/Battle breakers logo 1.png"
              alt="Battle Breakers"
              className="w-[40%] sm:w-[45%] md:w-[50%] lg:w-[55%] aspect-square object-contain mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            />

            {/* Game Name - responsive text */}
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              Battle Breakers
            </motion.h2>

            {/* Start Button - responsive width */}
            <motion.button
              className="w-full max-w-xs h-10 sm:h-12 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartGame}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start Game'}
            </motion.button>
          </motion.div>
        </div>
      ) : gameCompleted ? (
        // Game completion screen
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

          {/* Game node mini in the bottom left corner */}
          <div className="absolute bottom-8 left-8 z-10">
            <GameNodeMini
              title="Battle Breakers"
              icon="/Battle breakers logo 1.png"
            />
          </div>

          {/* Completion glass container */}
          <div className="w-150 h-[600px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative">
            {/* Game icon */}
            <motion.img
              src="/Battle breakers logo 1.png"
              alt="Battle Breakers"
              className="w-96 h-56 object-contain mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />

            {/* Game name */}
            <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
              Battle Breakers
            </div>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-purple-600/30 rounded-full border-4 border-purple-500/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>

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
                You've completed all the questions in this round!
              </p>
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
        <div className="flex flex-col items-center justify-center min-h-screen py-8 relative">
          {/* Game node mini in the bottom left corner */}
          <div className="absolute bottom-8 left-8 z-10">
            <GameNodeMini
              title="Battle Breakers"
              icon="/Battle breakers logo 1.png"
            />
          </div>

          {/* Main game container - enhanced glass effect */}
          <motion.div
            className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22),0px_4px_25px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-[8px] flex flex-col items-center justify-between p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))',
            }}
          >
            {/* Question counter */}
            <div className="w-full flex justify-between items-center mb-8">
              <div className="bg-violet-900/40 px-4 py-2 rounded-lg border border-violet-700/30 shadow-lg">
                <span className="text-white font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="bg-violet-900/40 px-4 py-2 rounded-lg border border-violet-700/30 shadow-lg">
                <span className="text-white font-medium">
                  Round 1
                </span>
              </div>
            </div>

            {/* Question display area - with improved styling */}
            <div className="w-[973px] h-44 bg-zinc-200/90 rounded-md flex items-center justify-center mb-6 shadow-md border border-gray-300/50">
              <p className="text-3xl font-bold text-gray-800 px-8 text-center">
                {questions[currentQuestion].question}
              </p>
            </div>

            {/* Space for response feedback - 
                In the future, this area could show "Buzz registered!" or similar messages
                when the buzzer dashboard responds to the user's buzz
            */}
            <AnimatePresence>
              {isPressedBuzzer && (
                <motion.div
                  className="w-[973px] mb-4 bg-green-700/30 rounded-md flex items-center justify-center border border-green-500/30 p-3"
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-xl font-semibold text-white">
                      Buzz registered!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buzzer button container */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex flex-col items-center">
                {/* Red button - separated and animated */}
                <motion.div
                  animate={{
                    y: isPressedBuzzer ? 15 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                  }}
                  onClick={handleBuzzerPress}
                  style={{ 
                    marginBottom: "-140px", // Negative margin to move closer to base
                    zIndex: 10 
                  }}
                >
                  <motion.div 
                    className="w-72 h-40 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{
                      scale: 1.03,
                      filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))"
                    }}
                    whileTap={{
                      scale: 0.97,
                      y: 5
                    }}
                    style={{
                      backgroundImage: 'url("/red-button.png")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: "drop-shadow(0 0 8px rgba(255, 0, 0, 0.4))"
                    }}
                  >
                  </motion.div>
                </motion.div>

                {/* Base button - separated as a static element below */}
                <div>
                  <img
                    src="/btn-base.png"
                    alt="Buzzer Base"
                    className="w-72 h-auto"
                    style={{ zIndex: 5 }}
                  />
                </div>
              </div>

              <p className="text-white/90 mt-4 font-medium">Press to answer!</p>
            </div>

                {/* Administrative button for testing - will be removed in production */}
            <div className="mt-2 mb-4">
              <button
                className="px-4 py-2 bg-gray-800/50 text-gray-300 text-sm border border-gray-700/50 rounded hover:bg-gray-700/50"
                onClick={handleNextQuestion}
              >
                Next Question (Admin)
              </button>
            </div>

            {/* Questions remaining indicator */}
            <div className="text-white/90 text-lg">
              Remaining Questions: {questions.length - currentQuestion - 1}
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="h-6"></div>

          {/* Timer progress bar - smoother animation */}
          <motion.div
            className="mt-4 mb-2 w-[720px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-full bg-gray-700/40 rounded-full h-3 shadow-inner border border-gray-700/20">
              <motion.div
                className={`${timeRemaining < 10 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  timeRemaining < 20 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                    'bg-gradient-to-r from-violet-800 to-violet-600'
                  } h-3 rounded-full shadow-[0_0_5px_rgba(140,20,252,0.5)]`}
                initial={{ width: "100%" }}
                animate={{ width: `${(timeRemaining / 30) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Time remaining display - enhanced styling */}
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${timeRemaining < 5 ? 'text-red-400 animate-pulse' :
              timeRemaining < 10 ? 'text-amber-300' :
                'text-white/70'
              } mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono font-medium ${timeRemaining < 5 ? 'text-red-400 animate-pulse' :
              timeRemaining < 10 ? 'text-amber-300' :
                'text-white/80'
              }`}>
              Time remaining: {timeRemaining}s
            </span>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
