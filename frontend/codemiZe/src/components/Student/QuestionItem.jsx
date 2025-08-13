import React, { memo } from 'react';

// Memoized component for individual questions to prevent re-rendering of all questions
const QuestionItem = memo(({ question, index, answer, onChange, disabled }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Question {index + 1}: {question.question}
      </h3>
      <textarea
        value={answer || ''}
        onChange={(e) => onChange(question._id, e.target.value)}
        className="w-full h-32 p-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        placeholder="Type your answer here..."
        disabled={disabled}
      />
    </div>
  );
});

export default QuestionItem;
