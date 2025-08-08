import React from 'react';
import { imagePath } from '../../../utils/helper.js';

const ResultsList = ({ results, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse text-gray-400">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 flex-grow overflow-y-auto custom-scrollbar">

      {results.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No results available yet</div>
      ) : (
        results.map((school, index) => (
          <div
            key={school.id}
            className="w-[860px] h-16 bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-sky-400 flex items-center relative overflow-hidden"
          >
            {/* Position number */}
            <div className="ml-6 flex items-center">
              <div className="justify-start text-purple-950 text-4xl font-medium font-['Oxanium']">
                {index + 1}
              </div>
            </div>
            {/* School logo rectangle */}
            <div className="ml-6 w-14 h-16 bg-neutral-500 rounded-md flex items-center justify-center overflow-hidden">
              <img src={imagePath(school.avatar.url)} alt={school.name} className="w-12 h-12 object-cover rounded" />
            </div>
            {/* School info */}
            <div className="ml-6 flex flex-col justify-center">
              <div className="text-black text-base font-medium font-['Oxanium']">
                {school.name}
              </div>
              <div className="text-black/70 text-xs font-medium font-['Inter']">
                {school.city}
              </div>
            </div>
            {/* Score rectangle */}
            <div className="ml-auto mr-6 flex items-center">
                <span className="text-sky-900 text-2xl font-bold font-['Oxanium']">{school.score}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultsList;