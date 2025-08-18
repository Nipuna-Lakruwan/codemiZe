import React from 'react';
import { motion } from 'framer-motion';

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

export default function StartScreen({ handleStartGame, isLoading }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Transparent glass box - with responsive sizing */}
      <motion.div
        className="w-full max-w-lg sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] h-auto aspect-[4/5] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Game Icon - responsive sizing */}
        <motion.img
          src="/CODE CRUSHERS.png"
          alt="Code Crushers"
          className="w-[40%] sm:w-[45%] md:w-[50%] lg:w-[55%] aspect-square object-contain mb-4 sm:mb-6"
          variants={iconVariants}
        />

        {/* Game Name - responsive text */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center"
          variants={textVariants}
        >
          Code Crushers
        </motion.h2>

        {/* Start Button - responsive width */}
        <motion.button
          className="w-full max-w-xs h-10 sm:h-12 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleStartGame}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Start Game'}
        </motion.button>
      </motion.div>
    </div>
  );
}
