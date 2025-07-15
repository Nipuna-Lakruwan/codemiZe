import React from 'react';
import { motion } from 'framer-motion';

const TeamRankItem = ({ index, team }) => {
  // Define border colors for different positions
  const getBorderColor = (position) => {
    switch (position) {
      case 0: return 'border-green-600';
      case 1: return 'border-blue-500';
      case 2: return 'border-yellow-500';
      case 3: return 'border-purple-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`w-full h-20 bg-stone-200 rounded-lg shadow-[3px_6px_14px_-2px_rgba(0,0,0,0.25)] border-l-[18px] ${getBorderColor(index)} flex items-center px-6 relative hover:bg-stone-100 transition-all duration-200`}
    >
      {/* Rank number */}
      <div className="w-8 justify-start text-purple-950 text-5xl font-bold font-['Oxanium'] mr-5">
        {index + 1}
      </div>

      {/* Team logo */}
      <div className="w-20 h-20 bg-neutral-500 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="w-full h-full object-contain p-1"
          />
        )}
      </div>

      {/* Team info */}
      <div className="flex-1 ml-8">
        <div className="w-full justify-start text-black text-lg font-medium font-['Oxanium'] truncate">
          {team.name}
        </div>
        <div className="w-20 justify-start text-black/70 text-sm font-medium font-['Inter']">
          {team.city}
        </div>
      </div>

      {/* Score */}
      <div className="justify-start text-sky-900 text-3xl font-bold font-['Oxanium'] ml-4">
        {team.score}
      </div>
    </motion.div>
  );
};

export default TeamRankItem;
