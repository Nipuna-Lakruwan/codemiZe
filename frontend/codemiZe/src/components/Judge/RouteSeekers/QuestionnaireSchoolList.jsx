import React from 'react';
import { motion } from 'framer-motion';

const QuestionnaireSchoolList = ({ schools, handleViewSchoolQuestions, setSelectedCard }) => (
  <div className="flex flex-col h-full items-center">
    {/* Heading with back button */}
    <div className="flex items-center w-full max-w-[900px] mb-10 mt-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mr-4 px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
        onClick={() => setSelectedCard(null)}
      >
        <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </motion.button>
      <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
        Questionnaire
      </div>
    </div>
    <div className="flex flex-col space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar w-full items-center">
      {schools.map((school) => (
        <div
          key={school.id}
          className="w-[800px] h-16 bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-sky-400 flex items-center relative overflow-hidden"
        >
          {/* School logo rectangle */}
          <div className="ml-6 w-14 h-16 bg-neutral-500 rounded-md flex items-center justify-center overflow-hidden">
            <img src={school.avatar?.url || "/c-logo.png"} alt={school.name} className="w-12 h-12 object-cover rounded" />
          </div>
          {/* School info */}
          <div className="ml-6 flex flex-col justify-center">
            <div className="text-black text-base font-medium font-['Oxanium']">
              {school.name}
            </div>
            <div className="text-black/70 text-xs font-medium font-['Inter']">
              {school.nameInShort}
            </div>
          </div>
          {/* View Button */}
          <div className="ml-auto mr-6 flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewSchoolQuestions(school)}
              className="w-20 h-7 bg-purple-900 rounded text-white text-xs flex items-center justify-center"
            >
              View
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionnaireSchoolList;