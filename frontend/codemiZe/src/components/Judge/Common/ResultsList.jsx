import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

const ResultsList = ({ results, isLoading = false }) => {
  const themeColor = 'rgba(62, 5, 128, 1)';

  // Get medal icon based on rank
  const getMedalIcon = (index) => {
    switch (index) {
      case 0: return <FaTrophy className="text-yellow-500" size={20} />;
      case 1: return <FaMedal className="text-gray-400" size={20} />;
      case 2: return <FaAward className="text-amber-700" size={20} />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse text-gray-400">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 flex-grow overflow-y-auto custom-scrollbar">
      {/* Underline */}
      <img src="/under-line.png" alt="underline" className="w-full h-1" />

      {results.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No results available yet</div>
      ) : (
        results.map((school, index) => (
          <motion.div
            key={school.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] ${index === 0 ? 'border-yellow-400' :
                index === 1 ? 'border-gray-400' :
                  index === 2 ? 'border-amber-700' :
                    'border-sky-400'
              } flex items-center h-16 relative overflow-hidden w-full`}
          >
            {/* Rank */}
            <div className="w-12 h-16 bg-gray-100 flex items-center justify-center font-bold text-lg">
              {index + 1}
            </div>

            {/* School Logo */}
            <div className="w-14 h-16 bg-neutral-100 flex items-center justify-center">
              <img src={school.avatar.url} alt={school.name} className="max-w-full max-h-full object-cover" />
            </div>

            {/* School Info */}
            <div className="flex-1 px-4">
              <div className="justify-start text-black text-base font-medium font-['Oxanium']">
                {school.name}
              </div>
              <div className="justify-start text-black/70 text-xs font-medium font-['Inter']">
                {school.city} ({school.nameInShort})
              </div>
            </div>

            {/* Score */}
            <div className="pr-4 flex items-center gap-2">
              {getMedalIcon(index)}
              <span className="font-bold text-lg" style={{ color: index < 3 ? themeColor : 'black' }}>
                {school.score}
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ResultsList;
