import React, { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import QuestionItem from './QuestionItem';

// Separate memoized component for the entire questionnaire activity
const QuestionnaireActivity = memo(({
  questions,
  answers,
  handleAnswerChange,
  questionnaireCompleted,
  handleSubmitQuestionnaire,
  networkCompleted,
  pdfContainerVariants,
  setShowResourcesModal
}) => {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Run animation only once
  useEffect(() => {
    if (!hasAnimated && containerRef.current) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  return (
    <motion.div
      ref={containerRef}
      className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6 relative"
      variants={pdfContainerVariants}
      initial={hasAnimated ? "visible" : "hidden"}
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Questionnaire</h2>

      <div className="w-[973px] h-[466px] bg-zinc-300 rounded-md p-6 relative overflow-hidden">
        <div className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar">
          {questions.map((question, index) => (
            <QuestionItem
              key={question._id}
              question={question}
              index={index}
              answer={answers.find(a => a.questionId === question._id)?.answer}
              onChange={handleAnswerChange}
              disabled={questionnaireCompleted}
            />
          ))}
        </div>
      </div>

      {/* Buttons container */}
      <div className="flex items-center mt-4 space-x-4">
        {!questionnaireCompleted ? (
          <motion.button
            className="px-6 py-2 bg-violet-700 text-white rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitQuestionnaire}
            disabled={answers.some(a => a.answer?.trim() === '' || !a.answer)}
          >
            Submit Questionnaire
          </motion.button>
        ) : (
          <div className="px-6 py-2 bg-green-600 text-white rounded-md font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Questionnaire Submitted
          </div>
        )}

        <motion.button
          className="px-6 py-2 bg-sky-600 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center gap-1"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(14, 165, 233, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResourcesModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Resources
        </motion.button>
      </div>

      {/* Network status */}
      <div className="absolute bottom-6 right-6">
        <div className="flex items-center">
          <span className="text-white mr-2">Network Diagram:</span>
          <div className={`px-3 py-1 rounded-full ${networkCompleted ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'}`}>
            {networkCompleted ? 'Completed' : 'Pending'}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default QuestionnaireActivity;
