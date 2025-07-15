import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const QuestionItem = ({
  question,
  number,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className="w-full h-14 bg-stone-50 rounded-md shadow-[3px_6px_14px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-purple-800 flex items-center justify-between pr-4 pl-7 overflow-hidden"
    >
      {/* Question Number */}
      <div className="min-w-[36px] h-[36px] flex items-center justify-center text-purple-800 rounded-full font-bold font-['Inter'] mr-3 text-base">
        {number}
      </div>

      <div className="flex-1 justify-start overflow-hidden">
        <span className="text-black/70 text-sm font-normal font-['Inter'] leading-tight truncate block">
          {question.question}
        </span>
        <span className="text-black/50 text-xs mt-1 block">
          {question.options.length} options • Correct: {question.correct}
        </span>
      </div>

      <div className="flex items-center gap-3 ml-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(question)}
          className="text-blue-600 hover:text-blue-800 p-1"
          title="View/Edit Question"
        >
          <FaEdit size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(question.id)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Delete Question"
        >
          <FaTrashAlt size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default QuestionItem;
