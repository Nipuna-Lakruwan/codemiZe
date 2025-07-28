import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';

const QuestionModal = ({
  isOpen,
  onClose,
  onSave,
  modalMode,
  currentQuestion,
  handleQuestionChange,
  handleOptionChange,
  handleCorrectAnswerChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-[550px] max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {modalMode === 'add' ? 'Add Question' : 'Edit Question'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </motion.button>
        </div>

        <div className="w-full h-0 outline-2 outline-offset-[-1px] outline-purple-800 my-4"></div>

        {/* Question */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={currentQuestion.question}
            onChange={handleQuestionChange}
            className="w-full h-24 bg-zinc-100 rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-800"
            placeholder="Enter your question here"
          />
        </div>

        {/* Answers */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Options
            <span className="block text-xs text-gray-500 mt-1">
              Format: <b>CorrectAnswer</b>, Option1, Option2, Option3
            </span>
          </label>
          <div className="w-full h-0 outline-1 outline-offset-[-0.50px] outline-black/30 mb-4"></div>

          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mb-4">
              {/* Removed radio button */}
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={
                  index === 0
                    ? "Correct Answer"
                    : `Option ${index + 1}`
                }
                className="flex-1 p-3 bg-zinc-100 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-purple-800"
              />
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-1 ml-7">
            The first field is always the correct answer.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium flex items-center gap-2"
          >
            <FaSave size={14} />
            {modalMode === 'add' ? 'Add Question' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionModal;
