import React from 'react';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import AdminBox from '../QuizComponents/AdminBox';

const TeamQuestionsView = ({ team, questions, onBack, onMarkCorrect, onMarkIncorrect }) => {
  return (
    <AdminBox title="Team Responses" minHeight="auto">
      <div className="w-full relative">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <FaArrowLeft className="w-7 h-7 mr-2" />
            <span className="text-sm font-medium">Back to teams</span>
          </button>
        </div>

        {/* Team info header - positioned at the top right */}
        <div className="absolute top-0 right-0 flex items-center bg-white rounded-lg shadow-sm p-2">
          <div>
            <div className="justify-end text-black text-base font-medium font-['Oxanium'] text-right">
              {team.name}
            </div>
            <div className="justify-end text-black/70 text-xs font-medium font-['Inter'] text-right">
              {team.city}
            </div>
          </div>
          <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center ml-3">
            <img
              src={team.logo || "/c-logo.png"}
              alt={team.name}
              className="max-w-full max-h-full object-cover"
            />
          </div>
        </div>

        {/* Extra margin to prevent content overlapping with the team info */}
        <div className="mt-16"></div>

        {/* Questions and answers */}
        <div className="space-y-6">
          {questions.map((item, index) => (
            <div key={index} className="mb-4">
              {/* Question */}
              <div className="justify-start text-black text-sm font-bold font-['Inter'] mb-2">
                {index + 1}. {item.question}
              </div>

              {/* Answer section */}
              <div className="flex items-center justify-between">
                <div className="justify-start text-black/80 text-sm font-['Inter'] flex-1">
                  <span className="font-medium">Answer:</span> {item.answer} <br />
                  <span className="font-medium">Correct Answer:</span> {item.correctAnswer}
                </div>

                {/* Marking buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onMarkCorrect(index)}
                    className={`${item.status === 'correct' ? 'bg-green-100' : ''} p-2 rounded-md hover:bg-green-50`}
                    title="Mark as correct"
                  >
                    <FaCheck className="w-6 h-6 text-green-600" />
                  </button>
                  <button
                    onClick={() => onMarkIncorrect(index)}
                    className={`${item.status === 'incorrect' ? 'bg-red-100' : ''} p-2 rounded-md hover:bg-red-50`}
                    title="Mark as incorrect"
                  >
                    <FaTimes className="w-6 h-6 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              {index < questions.length - 1 && (
                <div className="w-full h-0 outline-1 outline-offset-[-0.50px] outline-black/10 mt-4 border-t border-black/10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminBox>
  );
};

export default TeamQuestionsView;
