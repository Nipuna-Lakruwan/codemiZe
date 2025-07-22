import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimeWarningPopup({ show, timeRemaining }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-violet-900/80 px-6 py-3 rounded-lg border border-violet-500/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-violet-200 font-medium">
              {timeRemaining <= 60
                ? "Only 1 minute remaining!"
                : `${Math.floor(timeRemaining / 60)} minutes remaining!`}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
