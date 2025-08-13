import React from 'react';
import { motion } from 'framer-motion';

const QuestionnaireResponses = ({
  activeSchool,
  schoolQuestions,
  handleBackToSchools,
  handleMarkQuestion
}) => (
  <div className="w-full flex justify-center">
    <div className="bg-white rounded-lg shadow-md p-8 w-[1140px] h-[830px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackToSchools}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to schools</span>
        </button>
        <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
          <div>
            <div className="text-black text-base font-medium text-right">
              {activeSchool.name}
            </div>
            <div className="text-black/70 text-xs font-medium text-right">
              {activeSchool.nameInShort}
            </div>
          </div>
          <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center ml-3">
            <img
              src={activeSchool.avatar?.url || "/c-logo.png"}
              alt={activeSchool.name}
              className="max-w-full max-h-full object-cover"
            />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Questionnaire Responses</h3>
      <div className="space-y-6 mt-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {schoolQuestions.map((item, index) => (
          <div key={index} className="mb-4">
            {/* Question */}
            <div className="text-black text-sm font-bold mb-2">
              {index + 1}. {item.question}
            </div>
            {/* Answer section */}
            <div className="flex items-center justify-between flex-wrap">
              <div className="text-black/80 text-sm flex-1 min-w-[250px] mr-4">
                <div className="mb-2">
                  <span className="font-medium">Submitted Answer:</span> {item.answer}
                </div>
                <div>
                  <span className="font-medium">Correct Answer:</span> {item.correctAnswer}
                </div>
              </div>
              {/* Marking buttons */}
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleMarkQuestion(index, 'correct')}
                  className={`${item.status === 'correct' ? 'bg-green-100' : ''} p-2 rounded-md hover:bg-green-50`}
                  title="Mark as correct"
                >
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMarkQuestion(index, 'incorrect')}
                  className={`${item.status === 'incorrect' ? 'bg-red-100' : ''} p-2 rounded-md hover:bg-red-50`}
                  title="Mark as incorrect"
                >
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Divider */}
            {index < schoolQuestions.length - 1 && (
              <div className="w-full h-0 border-t border-black/10 mt-4"></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
        >
          Submit Marks
        </motion.button>
      </div>
    </div>
  </div>
);

export default QuestionnaireResponses;
