import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import AdminBox from '../QuizComponents/AdminBox';

const NetworkDesignSection = ({
  handleFileChange,
  handleNetworkResourceUpload,
  handleDeleteNetworkResources,
  handleResponseUpload,
  handleDownloadResources,
  resources,
  responses,
  selectedFile
}) => {
  return (
    <AdminBox width="flex-1 min-w-[300px]" minHeight="320px">
      <div className="flex flex-col space-y-4 mt-2">
        {/* Network Design Heading */}
        <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">Network Design</div>
        {/* Underline */}
        <img src="/under-line.png" alt="underline" className="w-full h-1" />

        {/* Upload Resource File Section */}
        <div className="mt-3 mb-3">
          <div className="flex items-center">
            <div className="justify-start text-black/60 text-xs font-medium font-['Inter']">Upload Slide</div>
            <div className="ml-2">
              <input
                type="file"
                id="networkResourceFile"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="networkResourceFile" className="cursor-pointer">
                <div className="w-11 h-5 bg-purple-800 rounded-sm flex items-center justify-center">
                  <FaUpload size={10} className="text-white" />
                </div>
              </label>
            </div>
            <motion.button
              onClick={handleNetworkResourceUpload}
              disabled={!selectedFile}
              className="ml-4 w-24 h-8 bg-purple-800 rounded-[3px] text-white text-xs flex items-center justify-center disabled:bg-gray-400"
            >
              Upload
            </motion.button>
          </div>

          <div className="mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteNetworkResources}
              className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
              disabled={resources === 0}
            >
              Delete Slides
            </motion.button>
          </div>
        </div>

        {/* Upload Responses Section */}
        <div className="mt-3">
          {/* Upload Responses Heading */}
          <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">Download Responses</div>
          {/* Underline */}
          <img src="/under-line.png" alt="underline" className="w-full h-1" />

          <div className="flex items-center mt-3">
            <div className="text-purple-800 text-3xl font-semibold font-['Inter'] mr-3">{responses}</div>
            <div className="text-sky-600 text-lg font-semibold font-['Oxanium']">Responses</div>
          </div>

          <div className="flex items-center mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadResources}
              className="w-32 h-8 bg-sky-600 rounded-[3px] text-white text-xs flex items-center justify-center"
              disabled={resources === 0}
            >
              Download Resources
            </motion.button>
          </div>
        </div>
      </div>
    </AdminBox>
  );
};

export default NetworkDesignSection;
