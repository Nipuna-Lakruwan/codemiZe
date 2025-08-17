import React from 'react';
import { motion } from 'framer-motion';

export default function GameCompletedScreen({ uploadedFile }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* Top left decorative image */}
      <img
        src="/left-robo.png"
        alt="Robot Mascot"
        className="absolute top-60 left-120 w-64 h-48 object-contain z-10 animate-mascot"
      />

      {/* Bottom right decorative image */}
      <img
        src="/right-robo.png"
        alt="Robot Mascot"
        className="absolute bottom-10 right-100 w-100 h-150 object-contain z-10 animate-mascot"
      />

      {/* Completion glass scoreboard */}
      <div className="w-150 h-[600px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative">
        {/* Game icon */}
        <motion.img
          src="/CODE CRUSHERS.png"
          alt="Code Crushers"
          className="w-96 h-56 object-contain mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />

        {/* Game name */}
        <div className="justify-start text-white text-3xl font-semibold font-['Oxanium'] mb-6">
          Code Crushers
        </div>

        {/* Status message */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-3xl font-bold text-green-400 mb-2">
            Well Done!
          </h3>
          <p className="text-xl text-white/80">
            Your code has been successfully submitted!
          </p>
        </motion.div>

        {/* File name display */}
        {uploadedFile && (
          <motion.div
            className="bg-purple-900/30 border border-purple-500/30 rounded-md p-4 mb-8 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white text-center">
              <span className="font-medium">Submitted file:</span> {uploadedFile.name}
            </p>
          </motion.div>
        )}

        {/* Road Map button with map icon */}
        <motion.button
          className="px-8 py-3 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => window.location.href = "/student/games-roadmap"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Road Map
        </motion.button>
      </div>
    </div>
  );
}
