import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

// Memoized component for activity selection to prevent re-rendering
const ActivitySelection = memo(({
  setActivity,
  questionnaireCompleted,
  networkCompleted,
  cardVariants
}) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Route Seekers</h1>
        <p className="text-white/80">Complete both activities to get full marks</p>
      </div>

      <div className="flex justify-center gap-10">
        {/* Questionnaire Card */}
        <motion.div
          className="w-80 h-96 bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 cursor-pointer"
          variants={cardVariants}
          initial={hasInitialized ? "visible" : "hidden"}
          animate="visible"
          whileHover="hover"
          onClick={() => setActivity('questionnaire')}
        >
          <div className="bg-violet-900/30 rounded-full p-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Questionnaire</h2>
          <p className="text-white/70 text-center mb-6">
            Answer network-related questions to test your knowledge
          </p>
          <div className={`px-4 py-1 rounded-full ${questionnaireCompleted ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'}`}>
            {questionnaireCompleted ? 'Completed' : 'Not Started'}
          </div>
        </motion.div>

        {/* Network Diagram Card */}
        <motion.div
          className="w-80 h-96 bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 cursor-pointer"
          variants={cardVariants}
          initial={hasInitialized ? "visible" : "hidden"}
          animate="visible"
          whileHover="hover"
          onClick={() => setActivity('network')}
        >
          <div className="bg-violet-900/30 rounded-full p-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Network Diagram</h2>
          <p className="text-white/70 text-center mb-6">
            Design and upload your network solution using Packet Tracer
          </p>
          <div className={`px-4 py-1 rounded-full ${networkCompleted ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'}`}>
            {networkCompleted ? 'Completed' : 'Not Started'}
          </div>
        </motion.div>
      </div>

      {/* Progress status */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center bg-stone-800/40 px-4 py-2 rounded-full">
          <span className="text-white mr-4">Progress:</span>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-2 ${questionnaireCompleted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-white">Questionnaire</span>
          </div>
          <div className="mx-4 text-white">+</div>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-2 ${networkCompleted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-white">Network Diagram</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ActivitySelection;
