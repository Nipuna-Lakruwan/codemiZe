import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../../context/SocketContext';
import { imagePath } from '../../../../utils/helper';

// QuestionDisplay Component
const QuestionDisplay = ({ question, questionNumber, timeRemaining }) => {
  return (
    <motion.div
      className="w-[568px] h-[709px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-purple-500/20 backdrop-blur-[8px] p-6 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Game image */}
      <div className="mb-8 flex justify-center">
        <img
          src="/Battle breakers logo 1.png"
          alt="Battle Breakers"
          className="w-200 h-80 object-contain"
        />
      </div>

      {/* Question display box */}
      <div className="w-[491px] bg-zinc-300 rounded-lg p-6 flex flex-col items-center shadow-md mx-auto">
        {/* Time remaining */}
        <div className="text-center text-black/75 text-2xl font-semibold font-['Inter'] mb-2 w-full">
          {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>

        {/* Time remaining bar */}
        <div className="w-96 h-1.5 bg-white rounded-2xl mb-6 mx-auto">
          <div
            className="h-full bg-purple-700 rounded-2xl"
            style={{ width: `${(timeRemaining / 30) * 100}%` }}
          ></div>
        </div>

        {/* Question number */}
        <div className="text-center w-full text-purple-950 text-3xl font-semibold font-['Oxanium'] mb-4">
          Question {questionNumber}
        </div>

        {/* Question text */}
        <div className="text-center text-black text-xl font-semibold font-['Inter'] w-full mx-auto">
          {question?.question}
        </div>
      </div>
    </motion.div>
  );
};

// TeamRankings Component
const TeamRankings = ({ buzzerPresses }) => {
  return (
    <motion.div
      className="w-[568px] h-[709px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-purple-500/20 backdrop-blur-[8px] p-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Team rankings */}
      <div className="flex-1 overflow-y-auto w-full mt-4">
        <div className="space-y-4">
          {buzzerPresses.map((press, index) => (
            <TeamRankItem
              key={press._id}
              index={index}
              team={press.team}
              responseTime={press.responseTime}
              isNew={Date.now() - new Date(press.timestamp).getTime() < 3000} // Mark as new for 3 seconds
            />
          ))}

          {/* Add empty placeholders for more teams */}
          {Array.from({ length: Math.max(0, 5 - buzzerPresses.length) }, (_, index) => (
            <EmptyRankItem key={`empty-${index}`} index={index + buzzerPresses.length} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// TeamRankItem Component
const TeamRankItem = ({ index, team, responseTime, isNew = false }) => {
  const borderColor = index === 0 ? 'border-green-600' : 'border-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`w-[516px] h-16 bg-stone-300 rounded-md shadow-[3px_6px_14px_-2px_rgba(0,0,0,0.25)] border-l-[15px] ${borderColor} flex items-center px-4 relative ${
        isNew ? 'ring-2 ring-yellow-400 animate-pulse' : ''
      }`}
    >
      {/* Rank number */}
      <div className="w-6 justify-start text-purple-950 text-4xl font-medium font-['Oxanium'] mr-3">
        {index + 1}
      </div>

      {/* Team logo */}
      <div className="w-16 h-16 bg-white/80 overflow-hidden flex items-center justify-center border border-gray-300 mr-4">
        <img
          src={team.logo}
          alt={`${team.name} logo`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Team info */}
      <div className="flex-1">
        <div className="w-64 justify-start text-black text-base font-medium font-['Oxanium'] truncate">
          {team.name}
        </div>
        <div className="w-20 justify-start text-black/70 text-xs font-medium font-['Inter']">
          {team.city}
        </div>
      </div>

      {/* Response time */}
      <div className="justify-start text-sky-900 text-2xl font-medium font-['Oxanium']">
        {typeof responseTime === 'number' ? (responseTime / 1000).toFixed(2) : '--'} s
      </div>


      {/* New indicator */}
      {/* {isNew && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
          NEW!
        </div>
      )} */}
    </motion.div>
  );
};

// EmptyRankItem Component
const EmptyRankItem = ({ index }) => {
  // Different border colors for different positions
  const borderColors = ['border-yellow-500', 'border-purple-500', 'border-gray-500'];

  // Use modulo to ensure we don't go out of bounds
  const colorIndex = index % borderColors.length;
  const position = index + 1; // Position number (3rd place and beyond)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`w-[516px] h-16 bg-stone-300/50 rounded-md shadow-[3px_6px_14px_-2px_rgba(0,0,0,0.15)] border-l-[15px] ${borderColors[colorIndex]} flex items-center px-4 relative`}
    >
      {/* Rank number */}
      <div className="w-6 justify-start text-purple-950 text-4xl font-medium font-['Oxanium'] mr-3 opacity-50">
        {position}
      </div>

      {/* Team logo placeholder */}
      <div className="w-16 h-16 bg-neutral-500/30 mr-4"></div>

      {/* Team info placeholder */}
      <div className="flex-1">
        <div className="w-64 h-4 bg-black/10 rounded mb-2"></div>
        <div className="w-20 h-3 bg-black/10 rounded"></div>
      </div>

      {/* Response time placeholder */}
      <div className="text-sky-900/30 text-2xl font-medium font-['Oxanium']">
        -- s
      </div>
    </motion.div>
  );
};

export default function BuzzerDashboard() {
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

  // Using fixed values for display-only frontend dashboard
  const [timeRemaining, setTimeRemaining] = useState(30);
  const currentQuestionIndex = 0;
  
  // State for real-time buzzer presses
  const [buzzerPresses, setBuzzerPresses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([{_id: "", question: ""}])

  useEffect(() => {
    // Listen for buzzer press events from the server
    if (socket) {
      socket.on("buzzerPress", (data) => {
        setBuzzerPresses((prevPresses) => [
          ...prevPresses,
          {
            _id: data._id,
            team: {
              name: data.name,
              city: data.city,
              logo: imagePath(data.logo),
            },
            responseTime: data.responseTime,
            timestamp: data.timestamp
          },
        ]);
      });

      socket.on("battleBreakers-startQuestionclient", (data) => {
        // Only clear buzzer presses if this is a new question (not a reconnection)
        if (!data.isReconnect) {
          clearBuzzerPresses();
        }
        setQuestions(() => [
          {
            _id: data._id,
            question: data.question,
          },
        ]);
        // Set initial timer state - will be updated by server timer
        setTimeRemaining(data.allocatedTime);
        setCurrentQuestion(data.questionNo);
        
        if (data.isReconnect) {
          console.log('BuzzerDashboard: Reconnected to active question');
        }
      });

      // Listen for synchronized timer updates from server
      socket.on("battleBreakers-timerUpdate", (data) => {
        setTimeRemaining(data.timeRemaining);
      });

      // Listen for timer synchronization (for newly connected clients)
      socket.on("battleBreakers-syncTimer", (data) => {
        // Update timer with accurate remaining time
        setTimeRemaining(data.timeRemaining);
      });

      // Listen for time up event from server
      socket.on("battleBreakers-timeUp", (data) => {
        setTimeRemaining(0);
      });

      // Listen for timer stopped event from server
      socket.on("battleBreakers-timerStopped", (data) => {
        // Timer has been stopped by admin
      });
      
      // Clean up the event listeners when component unmounts
      return () => {
        socket.off("buzzerPress");
        socket.off("battleBreakers-startQuestionclient");
        socket.off("battleBreakers-timerUpdate");
        socket.off("battleBreakers-syncTimer");
        socket.off("battleBreakers-timeUp");
        socket.off("battleBreakers-timerStopped");
      };
    }
  }, [socket]);


  // Function to clear buzzer presses for new question
  const clearBuzzerPresses = () => {
    setBuzzerPresses([]);
  };

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

        {/* Dashboard content - Two columns */}
        <motion.div
          className="flex justify-center gap-8 relative z-20 mt-10 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible">

          {/* Left column - Question Display Component */}
          <QuestionDisplay
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestion}
            totalQuestions={questions.length}
            timeRemaining={timeRemaining}
          />

          {/* Right column - Team Rankings Component */}
          <TeamRankings buzzerPresses={buzzerPresses} />
        </motion.div>

        {/* Admin Controls - positioned at bottom */}
        {/* <div className="absolute bottom-8 right-8 z-30 flex gap-4">
          <button
            onClick={clearBuzzerPresses}
            className="px-4 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear Buzzes
          </button>
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600/80 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next Question
          </button>
        </div> */}

        {/* Connection Status Indicator */}
        {/* <div className="absolute top-20 right-8 z-30">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${
            isConnected ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-300' : 'bg-red-300'
            }`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
