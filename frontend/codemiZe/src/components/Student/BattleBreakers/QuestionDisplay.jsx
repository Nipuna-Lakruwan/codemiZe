import React from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

export default function QuestionDisplay({
  questionNumber,
  totalQuestions,
  question,
  isCorrect,
  showAnswer,
  answer
}) {
  // Sanitize the HTML content for safety
  const sanitizedQuestion = DOMPurify.sanitize(question?.question || '');
  const sanitizedAnswer = DOMPurify.sanitize(answer || '');

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Question counter */}
      <motion.div
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-sm sm:text-base md:text-lg text-gray-300">
          Question <span className="font-bold">{questionNumber}</span> of <span>{totalQuestions}</span>
        </div>

        {/* Answer status indicator */}
        {isCorrect !== null && (
          <motion.div
            className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </motion.div>
        )}
      </motion.div>

      {/* Question container */}
      <motion.div
        className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg border border-slate-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Question content */}
        <div
          className="text-xl sm:text-2xl text-white mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedQuestion }}
        />

        {/* Show answer if applicable */}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
          >
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-lg font-medium text-yellow-300 mb-2">Answer:</p>
              <div
                className="text-white text-lg"
                dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
