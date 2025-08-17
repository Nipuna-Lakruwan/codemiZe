import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../context/SocketContext';
import CircularTimer from '../../../components/Games/CircularTimer';
import useSound from '../../../utils/useSound';

// Add custom Tailwind styles
import './TimerDashboard.css';

// GameLogoDisplay Component
const GameLogoDisplay = ({ gameInfo }) => {
  const { name, logo, description } = gameInfo;

  return (
    <motion.div
      className="w-[568px] h-[600px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-purple-500/20 backdrop-blur-[8px] p-6 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Game image */}
      <div className="mb-6 flex justify-center">
        <img
          src={logo}
          alt={name}
          className="w-[300px] h-[300px] object-contain"
        />
      </div>

      {/* Game name */}
      <div className="text-center w-full text-white text-5xl font-semibold font-['Oxanium'] mb-4">
        {name}
      </div>

      {/* Game description */}
      {description && (
        <div className="text-center text-white/80 text-2xl font-semibold font-['Inter'] w-full mx-auto">
          {description}
        </div>
      )}
    </motion.div>
  );
};

// TimesUp Overlay Component
const TimesUpOverlay = ({ isVisible, onClose }) => {
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background overlay with animation */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center w-full max-w-4xl px-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isVisible ? [0.9, 1.1, 1] : 0.8,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
      >
        {/* Animated alarm icon */}
        <motion.div
          className="text-red-500 text-8xl mb-8"
          animate={{
            rotate: isVisible ? [0, -10, 10, -10, 10, 0] : 0,
            scale: isVisible ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: isVisible ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
        </motion.div>

        {/* Times Up text with glow effect */}
        <motion.div
          className="text-red-500 text-[180px] font-bold font-['Oxanium'] tracking-wider drop-shadow-glow"
          animate={{
            scale: isVisible ? [1, 1.05, 1] : 1
          }}
          transition={{
            duration: 1.5,
            repeat: isVisible ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          TIME'S UP!
        </motion.div>

        {onClose && (
          <motion.button
            className="mt-12 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Dismiss
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

// TimerDisplay Component
const TimerDisplay = ({ timeRemaining, totalTime, gameName }) => {
  // State to manage Times Up overlay
  const [showTimesUp, setShowTimesUp] = useState(false);

  // Show Times Up overlay when timer reaches zero
  useEffect(() => {
    // Time's up
    if (timeRemaining === 0) {
      setShowTimesUp(true);
    } else if (timeRemaining > 0) {
      // Hide Times Up overlay if timer is reset or changed
      setShowTimesUp(false);
    }
  }, [timeRemaining]); return (
    <>
      <motion.div
        className="w-[650px] h-[680px] bg-stone-200/5 rounded-lg shadow-[0px_0px_40px_-6px_rgba(104,104,104,0.28)] border border-purple-500/30 backdrop-blur-[8px] p-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Game name */}
        <div className="text-center w-full text-white text-6xl font-semibold font-['Oxanium'] mb-6 mt-4">
          Time Remaining
        </div>

        {/* Circular Timer */}
        <div className="flex-1 flex items-center justify-center">
          <CircularTimer timeRemaining={timeRemaining} totalTime={totalTime} />
        </div>

        {/* Game in progress indicator */}
        <div className="mt-6 mb-3 text-center">
          <motion.div
            className="px-10 py-5 bg-green-500/20 rounded-full border border-green-500/50"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl text-white font-['Inter']">
              {gameName} in progress
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Times Up Overlay */}
      <TimesUpOverlay
        isVisible={showTimesUp}
        onClose={() => setShowTimesUp(false)}
      />
    </>
  );
};

// Mock timer for demonstration
const useMockTimer = (initialTime = 300, autoStart = false) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [totalTime] = useState(initialTime);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, time]);

  const start = useCallback((newTime = null) => {
    if (newTime !== null) setTime(newTime);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime = initialTime) => {
    setTime(newTime);
    setIsRunning(false);
  }, [initialTime]);

  return { time, isRunning, totalTime, start, stop, reset };
};

export default function TimerDashboard() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const socket = useContext(SocketContext);

  // Game state with demo mode
  const [activeGame, setActiveGame] = useState(null);
  const [demoMode, setDemoMode] = useState(true); // Start in demo mode by default
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound effects enabled by default

  // Sound effects hook
  const { playSound } = useSound({ enabled: soundEnabled });

  // Mock timer for demo mode
  const mockTimer = useMockTimer(60); // 3 minutes

  // Game info mapping - logos and descriptions for each game type
  const gameInfoMap = {
    'battleBreakers': {
      name: 'Battle Breakers',
      logo: '/Battle Breakers.png',
      description: 'Fast-paced buzzer competition'
    },
    'circuitSmashers': {
      name: 'Circuit Smashers',
      logo: '/circuit smashes.png',
      description: 'Electronics and circuit design challenge'
    },
    'codeCrushers': {
      name: 'Code Crushers',
      logo: '/CODE CRUSHERS.png',
      description: 'Coding and algorithm competition'
    },
    'routeSeekers': {
      name: 'Route Seekers',
      logo: '/robo1.png', // Using available robot image
      description: 'Navigation and problem-solving challenge'
    }
  };

  // Demo controls - for testing without backend
  const startDemoGame = (gameName) => {
    // Start the game without sound
    setActiveGame(gameName);
    mockTimer.reset(60); // Reset to 1 minute
    mockTimer.start();
  };

  useEffect(() => {
    // Add keyboard shortcuts for demo controls
    const handleKeyDown = (e) => {
      if (demoMode) {
        switch (e.key) {
          case '1':
            startDemoGame('battleBreakers');
            break;
          case '2':
            startDemoGame('circuitSmashers');
            break;
          case '3':
            startDemoGame('codeCrushers');
            break;
          case '4':
            startDemoGame('routeSeekers');
            break;
          case 'r':
            mockTimer.reset(180);
            mockTimer.start();
            break;
          case ' ':
            if (mockTimer.isRunning) {
              mockTimer.stop();
            } else {
              mockTimer.start();
            }
            break;
          case 'Escape':
            setActiveGame(null);
            mockTimer.stop();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoMode, mockTimer]);

  useEffect(() => {
    // Listen for game start events from the server
    if (socket && !demoMode) {
      // Handle Battle Breakers events
      socket.on("battleBreakers-startQuestionclient", (data) => {
        setActiveGame('battleBreakers');
        mockTimer.reset(data.allocatedTime || 180);
        mockTimer.start();
      });

      // Handle Circuit Smashers events
      socket.on("circuitSmashers-startGameclient", (data) => {
        setActiveGame('circuitSmashers');
        mockTimer.reset(data.allocatedTime || 180);
        mockTimer.start();
      });

      // Handle Code Crushers events
      socket.on("codeCrushers-startGameclient", (data) => {
        setActiveGame('codeCrushers');
        mockTimer.reset(data.allocatedTime || 180);
        mockTimer.start();
      });

      // Handle Route Seekers events
      socket.on("routeSeekers-startGameclient", (data) => {
        setActiveGame('routeSeekers');
        mockTimer.reset(data.allocatedTime || 180);
        mockTimer.start();
      });

      // Listen for timer updates for all games
      socket.on("battleBreakers-timerUpdate", (data) => {
        if (activeGame === 'battleBreakers') {
          mockTimer.reset(data.timeRemaining);
          mockTimer.start();
        }
      });

      socket.on("circuitSmashers-timerUpdate", (data) => {
        if (activeGame === 'circuitSmashers') {
          mockTimer.reset(data.timeRemaining);
          mockTimer.start();
        }
      });

      socket.on("codeCrushers-timerUpdate", (data) => {
        if (activeGame === 'codeCrushers') {
          mockTimer.reset(data.timeRemaining);
          mockTimer.start();
        }
      });

      socket.on("routeSeekers-timerUpdate", (data) => {
        if (activeGame === 'routeSeekers') {
          mockTimer.reset(data.timeRemaining);
          mockTimer.start();
        }
      });

      // Listen for game end events
      socket.on("battleBreakers-timeUp", () => {
        mockTimer.stop();
      });

      socket.on("circuitSmashers-timeUp", () => {
        mockTimer.stop();
      });

      socket.on("codeCrushers-timeUp", () => {
        mockTimer.stop();
      });

      socket.on("routeSeekers-timeUp", () => {
        mockTimer.stop();
      });

      // Clean up the event listeners when component unmounts
      return () => {
        socket.off("battleBreakers-startQuestionclient");
        socket.off("battleBreakers-timerUpdate");
        socket.off("battleBreakers-timeUp");

        socket.off("circuitSmashers-startGameclient");
        socket.off("circuitSmashers-timerUpdate");
        socket.off("circuitSmashers-timeUp");

        socket.off("codeCrushers-startGameclient");
        socket.off("codeCrushers-timerUpdate");
        socket.off("codeCrushers-timeUp");

        socket.off("routeSeekers-startGameclient");
        socket.off("routeSeekers-timerUpdate");
        socket.off("routeSeekers-timeUp");
      };
    }
  }, [socket, activeGame, demoMode, mockTimer]);

  // If no active game, show splash screen with game selection
  if (!activeGame) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
        style={{ backgroundImage: "url('/background.jpg')" }}>
        <div className="min-h-screen w-full bg-gradient-to-b from-black/80 via-black/75 to-purple-900/20 p-6 flex items-center justify-center">
          <div className="text-white text-4xl font-['Oxanium'] text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <img src="/codemize-logo.png" alt="CodemiZe Logo" className="w-96 mx-auto mb-10" />
              <div className="mb-10">Timer Dashboard</div>

              {demoMode && (
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-8 text-yellow-300">DEMO MODE ACTIVE</div>
                  <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {Object.keys(gameInfoMap).map((game, index) => (
                      <motion.button
                        key={game}
                        className="px-8 py-6 bg-purple-800/50 hover:bg-purple-700/70 rounded-lg border-2 border-purple-500/50 transition-all flex flex-col items-center"
                        onClick={() => startDemoGame(game)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img src={gameInfoMap[game].logo} alt={gameInfoMap[game].name} className="h-20 w-auto mb-4" />
                        <span>Start {gameInfoMap[game].name}</span>
                        <span className="text-sm mt-2 text-purple-300">(Press {index + 1})</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-base mt-10 text-gray-300 max-w-lg">
                    Keyboard Controls: <br />
                    1-4: Select game | SPACE: Pause/Resume | R: Reset timer | ESC: Exit game
                  </div>
                </div>
              )}

              {!demoMode && (
                <div>Waiting for a game to start...</div>
              )}

              <div className="mt-8 flex flex-col gap-4">
                {/* Sound toggle button */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${soundEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    <span>{soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}</span>
                  </button>
                </div>

                {/* Demo mode toggle */}
                <div>
                  <button
                    className={`px-4 py-2 rounded-md text-sm ${demoMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={() => setDemoMode(!demoMode)}
                  >
                    {demoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Get the active game info
  const gameInfo = gameInfoMap[activeGame];

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{ backgroundImage: "url('/background.jpg')" }}>
      {/* Dark gradient overlay */}
      <div className="min-h-screen w-full bg-gradient-to-b from-black/80 via-black/75 to-purple-900/20 p-6">
        {/* Central c-logo in background */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-20">
          <img
            src="/login-title.png"
            alt="CodemiZe Central Logo"
            className="w-[1100px] h-auto"
          />
        </div>

        {/* Top campus logo */}
        <div className="absolute top-0 left-0 z-20 bg-white rounded-br-lg p-3 shadow-md">
          <img
            src="/campus-logo.png"
            alt="Campus Logo"
            className="h-18 w-auto"
          />
        </div>

        {demoMode && (
          <div className="absolute top-4 right-4 z-30 bg-yellow-500/80 text-black px-4 py-2 rounded-md text-sm font-bold">
            DEMO MODE
          </div>
        )}

        {/* Sound toggle button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <button
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 ${soundEnabled ? 'bg-blue-600/70 hover:bg-blue-600/90' : 'bg-gray-600/70 hover:bg-gray-600/90'
              }`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
          </button>
        </div>

        {/* Dashboard content - Two columns - Centered vertically */}
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] relative z-20">
          <motion.div
            className="flex justify-center gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible">

            {/* Left column - Game Logo Display */}
            <GameLogoDisplay gameInfo={gameInfo} />

            {/* Right column - Timer Display - made bigger */}
            <TimerDisplay
              timeRemaining={demoMode ? mockTimer.time : 0}
              totalTime={demoMode ? mockTimer.totalTime : 180}
              gameName={gameInfo.name}
            />
          </motion.div>
        </div>        {/* Demo controls - small controls at the bottom */}
        {demoMode && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
            <button
              className="px-4 py-2 bg-blue-500/70 hover:bg-blue-600/90 rounded-md text-white text-sm shadow-lg"
              onClick={() => {
                if (mockTimer.isRunning) mockTimer.stop();
                else mockTimer.start();
              }}
            >
              {mockTimer.isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              className="px-4 py-2 bg-purple-500/70 hover:bg-purple-600/90 rounded-md text-white text-sm shadow-lg"
              onClick={() => {
                // Reset without sound
                mockTimer.reset(180);
                mockTimer.start();
              }}
            >
              Reset (3:00)
            </button>
            <button
              className="px-4 py-2 bg-red-500/70 hover:bg-red-600/90 rounded-md text-white text-sm shadow-lg"
              onClick={() => setActiveGame(null)}
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
