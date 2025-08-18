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


// Removed mock timer – server authoritative updates are used instead

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

  const [activeGame, setActiveGame] = useState(null);
  const { playSound } = useSound({ enabled: true });
  // Central timer state (server authoritative)
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  // Keep per‑game state snapshots to avoid race conditions
  const [gameStates, setGameStates] = useState({});

  // Game info mapping - logos and descriptions for each game type
  const gameInfoMap = {
    'circuitSmashers': {
      name: 'Circuit Smashers',
      logo: '/circuit samshers logo 1.png',
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

  useEffect(() => {
    if (!socket) return;

    const handleTimerState = (gameName, data) => {
      setGameStates(prev => ({ ...prev, [gameName]: data }));
    };

    socket.on("circuitSmashers-currentState", (data) => handleTimerState('circuitSmashers', data));
    socket.on("codeCrushers-currentState", (data) => handleTimerState('codeCrushers', data));
    socket.on("routeSeekers-currentState", (data) => handleTimerState('routeSeekers', data));

    // Request current state for all games on connect
    socket.emit("circuitSmashers-requestCurrentState");
    socket.emit("codeCrushers-requestCurrentState");
    socket.emit("routeSeekers-requestCurrentState");

    return () => {
      socket.off("circuitSmashers-currentState");
      socket.off("codeCrushers-currentState");
      socket.off("routeSeekers-currentState");
    };
  }, [socket]);

  // Decide which game is active based on collected states (first active wins unless replaced by another active)
  useEffect(() => {
    // Find any game with an active round
    const entries = Object.entries(gameStates);
    const activeEntry = entries.find(([, v]) => (v?.isRoundActive || v?.isActive) && (v.timeRemaining > 0 || v.allocatedTime > 0));
    if (activeEntry) {
      const [gameName, data] = activeEntry;
      if (activeGame !== gameName) {
        setActiveGame(gameName);
        const t = data.timeRemaining || data.allocatedTime || 0;
        setTotalTime(data.allocatedTime || t);
        setTimeRemaining(t);
        // play sound only on change
        playSound('gameStart');
      } else {
        // Same active game: keep timer in sync without resetting total unless provided
        if (typeof data.timeRemaining === 'number') {
          setTimeRemaining(data.timeRemaining);
        }
        if (data.allocatedTime) setTotalTime(data.allocatedTime);
      }
    }
  }, [gameStates, activeGame, playSound]);

  useEffect(() => {
    // Listen for game start events from the server
    if (socket) {
      console.log('Socket connected, setting up event listeners');
      
      // Handle Circuit Smashers events
      socket.on("circuitSmashers-roundStarted", (data) => {
        console.log('Circuit Smashers game started:', data);
        setActiveGame('circuitSmashers');
        const timeToSet = data.allocatedTime || 1800;
        setTotalTime(timeToSet);
        setTimeRemaining(timeToSet);
        playSound('gameStart');
      });

      // Handle Code Crushers events
      socket.on("codeCrushers-roundStarted", (data) => {
        console.log('Code Crushers game started:', data);
        setActiveGame('codeCrushers');
        const timeToSet = data.allocatedTime || 1800;
        setTotalTime(timeToSet);
        setTimeRemaining(timeToSet);
        playSound('gameStart');
      });

      // Handle Route Seekers events
      socket.on("routeSeekers-roundStarted", (data) => {
        console.log('Route Seekers game started:', data);
        setActiveGame('routeSeekers');
        const timeToSet = data.allocatedTime || 2400;
        setTotalTime(timeToSet);
        setTimeRemaining(timeToSet);
        playSound('gameStart');
      });

      // Listen for timer updates for all games
      socket.on("circuitSmashers-timerUpdate", (data) => {
        if (activeGame === 'circuitSmashers') {
          setTimeRemaining(data.timeRemaining);
        }
      });

      socket.on("codeCrushers-timerUpdate", (data) => {
        if (activeGame === 'codeCrushers') {
          setTimeRemaining(data.timeRemaining);
        }
      });

      socket.on("routeSeekers-timerUpdate", (data) => {
        if (activeGame === 'routeSeekers') {
          setTimeRemaining(data.timeRemaining);
        }
      });

      // Listen for game end events
      socket.on("circuitSmashers-timeUp", () => {
        if (activeGame === 'circuitSmashers') setTimeRemaining(0);
        playSound('timeUp');
      });

      socket.on("codeCrushers-timeUp", () => {
        if (activeGame === 'codeCrushers') setTimeRemaining(0);
        playSound('timeUp');
      });

      socket.on("routeSeekers-timeUp", () => {
        if (activeGame === 'routeSeekers') setTimeRemaining(0);
        playSound('timeUp');
      });

      // Clean up the event listeners when component unmounts
      return () => {
        socket.off("circuitSmashers-roundStarted");
        socket.off("circuitSmashers-timerUpdate");
        socket.off("circuitSmashers-timeUp");

        socket.off("codeCrushers-roundStarted");
        socket.off("codeCrushers-timerUpdate");
        socket.off("codeCrushers-timeUp");

        socket.off("routeSeekers-roundStarted");
        socket.off("routeSeekers-timerUpdate");
        socket.off("routeSeekers-timeUp");
      };
    }
  }, [socket, activeGame, playSound]);

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
              <div>Waiting for a game to start...</div>
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
              timeRemaining={timeRemaining}
              totalTime={totalTime || timeRemaining}
              gameName={gameInfo.name}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
