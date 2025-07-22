import React from 'react';
import AdminBox from '../QuizComponents/AdminBox';

const QuestionersResponsesSection = ({ responses }) => {
  return (
    <AdminBox title="Questioners Responses" width="w-56" minHeight="200px">
      {/* Underline */}
      <img src="/under-line.png" alt="underline" className="w-full h-1" />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-purple-800 text-4xl font-semibold font-['Inter'] mt-4">{responses}</div>
        <div className="text-sky-600 text-lg font-semibold font-['Oxanium'] mb-2">Responses</div>
      </div>
    </AdminBox>
  );
};

export default QuestionersResponsesSection;
