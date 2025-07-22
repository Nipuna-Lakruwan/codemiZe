import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

export default function GameCompletedScreen({ score, totalQuestions, teamName }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Confetti effect */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.1}
      />

      {/* Transparent glass box - with responsive sizing */}
      <motion.div
        className="w-full max-w-lg sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] h-auto aspect-[4/5] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trophy/Winner Icon - responsive sizing */}
        <motion.img
          src="/Winners.png"
          alt="Game Completed"
          className="w-[35%] sm:w-[40%] md:w-[45%] lg:w-[50%] aspect-square object-contain mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
        />

        {/* Congratulations Message - responsive text */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Congratulations!
        </motion.h2>

        {/* Team Name */}
        {teamName && (
          <motion.p
            className="text-xl sm:text-2xl text-yellow-300 mb-6 text-center font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Team {teamName}
          </motion.p>
        )}

        {/* Score Display */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <p className="text-lg sm:text-xl text-white text-center">
            You scored
          </p>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white flex items-baseline gap-2 mt-2">
            <span className="text-green-400">{score}</span>
            <span className="text-white text-lg sm:text-xl opacity-80">/ {totalQuestions}</span>
          </div>
        </motion.div>

        {/* Message based on score */}
        <motion.p
          className="text-base sm:text-lg text-white text-center mb-8 max-w-[80%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {score === totalQuestions
            ? "Perfect score! You're a Battle Breakers champion!"
            : score > totalQuestions / 2
              ? "Great job! Keep up the good work!"
              : "Good effort! Practice more and try again!"}
        </motion.p>

        {/* Return to Dashboard button */}
        <motion.button
          className="w-full max-w-xs h-10 sm:h-12 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/student/dashboard'}
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
