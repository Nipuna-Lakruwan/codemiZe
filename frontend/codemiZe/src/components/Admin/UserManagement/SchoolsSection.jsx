import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminBox from '../QuizComponents/AdminBox';

export default function SchoolsSection({
  schools,
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <AdminBox title="Schools">
      <div className="flex flex-col space-y-4 mt-2">
        {/* Underline */}
        <img src="/under-line.png" alt="underline" className="w-full h-1" />

        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="px-4 py-2 bg-purple-800 text-white rounded flex items-center gap-1"
          >
            <FaPlus size={14} />
            Add School
          </motion.button>
        </div>

        <div className="flex flex-col space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {schools.map(school => (
            <div
              key={school.id}
              className="bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-sky-400 flex items-center h-16 relative overflow-hidden w-full"
            >
              {/* School Logo */}
              <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center">
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

              {/* Action Buttons */}
              <div className="pr-2 flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(school.id, 'school')}
                  className="w-8 h-7 bg-blue-600 rounded-[3px] flex items-center justify-center"
                >
                  <FaEdit className="text-white text-xs" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(school.id, 'school')}
                  className="w-8 h-7 bg-red-600 rounded-[3px] flex items-center justify-center"
                >
                  <FaTrash className="text-white text-xs" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminBox>
  );
}
