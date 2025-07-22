import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import AdminBox from '../QuizComponents/AdminBox';

const QuestionnaireSection = ({
  handleFileChange,
  handleDeleteQuestions,
  handleViewQuestions,
  handleDeleteResources,
  questions,
  resources
}) => {
  return (
    <AdminBox width="flex-1 min-w-[300px]" minHeight="320px">
      <div className="flex flex-col space-y-4 mt-2">
        {/* Heading */}
        <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">Questionnaire</div>
        {/* Underline */}
        <img src="/under-line.png" alt="underline" className="w-full h-1" />

        {/* Upload Questions Section */}
        <div className="mt-3 mb-3">
          <div className="flex items-center">
            <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload Questions</div>
            <div className="ml-2">
              <input
                type="file"
                id="questionFile"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="questionFile" className="cursor-pointer">
                <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                  <FaUpload size={10} className="text-white" />
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteQuestions}
              className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
              disabled={questions === 0}
            >
              Delete Question
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewQuestions}
              className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
              disabled={questions === 0}
            >
              View Question
            </motion.button>
          </div>
        </div>

        {/* Upload Resource File Section */}
        <div className="mt-3">
          <div className="flex items-center">
            <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload Resource File</div>
            <div className="ml-2">
              <input
                type="file"
                id="resourceFile"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resourceFile" className="cursor-pointer">
                <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                  <FaUpload size={10} className="text-white" />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteResources}
              className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
              disabled={resources === 0}
            >
              Delete Resources
            </motion.button>
          </div>
        </div>
      </div>
    </AdminBox>
  );
};

export default QuestionnaireSection;
