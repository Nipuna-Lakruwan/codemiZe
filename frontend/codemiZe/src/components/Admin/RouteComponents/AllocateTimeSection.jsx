import React from 'react';
import { motion } from 'framer-motion';
import AdminBox from '../QuizComponents/AdminBox';

const AllocateTimeSection = ({
  allocatedTime,
  customTime,
  handleTimeChange,
  handleCustomTimeChange,
  handleConfirmTime
}) => {
  return (
    <AdminBox title="Allocate Time" width="w-48" minHeight="200px">
      {/* Underline */}
      <img src="/under-line.png" alt="underline" className="w-full h-1" />
      <div className="flex flex-col gap-4 items-center mt-6">
        <div className="w-32 h-10 bg-zinc-200 rounded-md flex items-center justify-center">
          <select
            value={allocatedTime}
            onChange={handleTimeChange}
            className="w-full h-full px-2 bg-transparent border-none rounded-md focus:outline-none text-sm"
          >
            {[15, 30, 45, 60, 90, 120].map((time) => (
              <option key={time} value={time}>{time} min</option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>

        {allocatedTime === 'custom' && (
          <input
            type="number"
            value={customTime}
            onChange={handleCustomTimeChange}
            placeholder="Minutes"
            className="w-32 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-800 text-sm"
            min="1"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirmTime}
          className="w-32 h-10 bg-sky-600 rounded-[3px] text-white text-sm font-medium"
        >
          Confirm
        </motion.button>
      </div>
    </AdminBox>
  );
};

export default AllocateTimeSection;
