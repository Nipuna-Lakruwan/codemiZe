import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

export default function UploadModal({ show, onClose, onFileUpload, uploadedFile, isFileValid, onSubmit, fileInputRef }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-stone-900/90 rounded-lg border border-white/10 p-6 max-w-md w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Upload Python Code</h3>
            <p className="text-white/70 mb-6">Please upload a .py file with your solution.</p>

            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileUpload}
                accept=".py"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 bg-stone-800/50 border-2 border-dashed border-violet-500/30 rounded-lg cursor-pointer hover:bg-stone-800/70 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-violet-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-violet-300">Click to select a file</span>
                <span className="text-xs text-violet-400/70 mt-1">(Python .py files only)</span>
              </label>
            </div>

            {uploadedFile && (
              <div className="mb-6 p-3 bg-stone-800/50 rounded border border-stone-700/50">
                <p className="text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {uploadedFile.name}
                  {!isFileValid && (
                    <span className="ml-auto text-red-400 text-sm">
                      Invalid file type (must be .py)
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-600 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${isFileValid
                  ? 'bg-violet-700 text-white hover:bg-violet-600'
                  : 'bg-violet-900/40 text-white/50 cursor-not-allowed'} transition-colors`}
                onClick={onSubmit}
                disabled={!isFileValid}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
