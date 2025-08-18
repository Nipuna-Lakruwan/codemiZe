import React from 'react';
import { motion } from 'framer-motion';
import GameNodeMini from '../../../components/Games/GameNodeMini';

const pdfContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const uploadButtonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 0.3
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 10px rgba(140, 20, 252, 0.7)",
    transition: {
      duration: 0.2
    }
  }
};

export default function ActiveGameScreen({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
  timeRemaining,
  calculateProgress,
  formatTime,
  setShowUploadModal
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Game node mini in the bottom left corner */}
      <div className="absolute bottom-8 left-8 z-10">
        <GameNodeMini
          title="Code Crushers"
          icon="/CODE CRUSHERS.png"
        />
      </div>

      {/* Main PDF viewer container */}
      <motion.div
        className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6"
        variants={pdfContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* PDF content area */}
        <div className="w-[973px] h-[466px] bg-zinc-300 rounded-md flex items-center justify-center mb-4">
          <div className="text-center">
            <p className="text-2xl text-gray-600 font-semibold">PDF Viewer</p>
            <p className="text-gray-500">Page {currentPage} of {totalPages}</p>
            <p className="text-sm text-gray-400 mt-4">Scenario and coding problem description would appear here</p>
          </div>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center justify-center space-x-6">
          <button
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Back
          </button>

          <div className="text-white/80">
            Page {currentPage} of {totalPages}
          </div>

          <button
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'} text-white transition-colors`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Spacer between PDF viewer and progress bar */}
      <div className="h-6"></div>

      {/* Progress bar for timer */}
      <motion.div
        className="mt-4 mb-4 w-[720px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full bg-gray-700/30 rounded-full h-2.5 mb-3">
          <motion.div
            className={`${timeRemaining < 300 ? 'bg-violet-500' : 'bg-violet-900'
              } h-2.5 rounded-full`}
            initial={{ width: "100%" }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Time remaining display */}
      <motion.div
        className="flex justify-center w-full mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`font-mono font-medium ${timeRemaining < 60 ? 'text-red-400 animate-pulse' :
            timeRemaining < 300 ? 'text-violet-300' :
              'text-white/80'
            }`}>
            Time remaining: {formatTime(timeRemaining)}
          </span>
        </div>
      </motion.div>

      {/* Upload code button */}
      <motion.button
        className="px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center gap-2"
        variants={uploadButtonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setShowUploadModal(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Code (.py)
      </motion.button>
    </div>
  );
}
