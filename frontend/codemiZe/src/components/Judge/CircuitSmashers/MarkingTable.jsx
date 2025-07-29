import React from 'react';
import { motion } from 'framer-motion';

const MarkingTable = ({
  schools,
  criteria,
  markings,
  handleMarkUpdate,
  handleKeyDown,
  calculateTotal
}) => (
  <div className="flex flex-col h-full w-full items-center">
    <div className="w-[1020px] h-[540px] bg-white rounded-[5px] border border-black/90 mx-auto flex flex-col">
      <div className="overflow-x-auto w-full flex-1">
        <div className="relative h-full flex flex-col">
          <table className="w-max bg-white" style={{ minWidth: '970px' }}>
            <thead>
              <tr className="bg-gray-100 border-b border-black/20">
                <th className="py-3 px-4 text-left text-sm font-medium text-purple-800 w-40 sticky left-0 bg-gray-100 z-10">Criteria</th>
                {schools.map((school) => (
                  <th key={school.id} className="py-2 px-3 text-center text-sm font-medium text-purple-800 border-l border-black/20 min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                        <img
                          src={school.avatar?.url || '/c-logo.png'}
                          alt={school.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium">{school.nameInShort}</span>
                      <span className="text-[10px] text-gray-500 mb-1 truncate max-w-[110px]" title={school.name}>{school.name}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-1 text-[10px] bg-sky-600 text-white px-2 py-1 rounded text-center"
                      >
                        Download
                      </motion.button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (
                <tr key={criterion.id} className="border-b border-black/20">
                  <td className="py-3 px-4 text-sm font-medium sticky left-0 bg-white border-r border-black/20 z-10">
                    {criterion.criteria}
                  </td>
                  {schools.map((school) => (
                    <td key={`${school.id}-${criterion.id}`} className="py-2 px-3 text-center border-l border-black/20">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={markings[school.id]?.[criterion.id] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            handleMarkUpdate(school.id, criterion.id, 0);
                          } else {
                            const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
                            handleMarkUpdate(school.id, criterion.id, numValue);
                          }
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-14 h-9 border border-gray-300 rounded text-center font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label={`Score for ${school.name} on ${criterion.criteria}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-purple-50">
                <td className="py-3 px-4 text-sm font-bold text-purple-800 sticky left-0 bg-purple-50 border-r border-black/20 z-10">
                  Total Score
                </td>
                {schools.map((school) => (
                  <td key={`${school.id}-total`} className="py-2 px-3 text-center font-bold text-purple-800 border-l border-black/20">
                    {calculateTotal(school.id)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div className="mt-8 flex justify-end w-[1020px]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
      >
        Submit All Marks
      </motion.button>
    </div>
  </div>
);

export default MarkingTable;
