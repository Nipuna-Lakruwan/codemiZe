import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimesUpPopup({ show, isFileValid, onContinue, onSubmit }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-red-900/80 px-8 py-6 rounded-lg border border-red-500/30 max-w-md text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-red-100 mb-2">Time's Up!</h2>
            <p className="text-red-200 mb-6">Please submit your code or try again.</p>
            <div className="flex space-x-4 justify-center">
              <motion.button
                className="px-6 py-2 bg-red-800 text-white rounded-md border border-red-600/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
              >
                Continue
              </motion.button>
              {isFileValid && (
                <motion.button
                  className="px-6 py-2 bg-green-800 text-white rounded-md border border-green-600/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSubmit}
                >
                  Submit Code
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
