import React from 'react';
import { motion } from 'framer-motion';

export default function StartScreen({ handleStartGame, isLoading }) {
  return (
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
  );
}
