import React, { useRef, useEffect } from 'react';
import { FaPen, FaTrashAlt, FaGripVertical } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CriteriaItem = ({
  criteria,
  isEditing,
  editingText,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  gameSpecific = false,
  gameName = ''
}) => {
  // Ref for auto-focusing the input when editing starts
  const inputRef = useRef(null);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Handle keyboard events for editing mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between group hover:bg-gray-100 transition-colors">
      {isEditing ? (
        <div className="flex-1 flex">
          <input
            ref={inputRef}
            type="text"
            value={editingText}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Edit criteria text"
          />
          <div className="flex">
            <button
              onClick={onSaveEdit}
              className="bg-green-600 text-white px-3 py-2 hover:bg-green-700"
              aria-label="Save changes"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-600 text-white px-3 py-2 rounded-r-md hover:bg-gray-700"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* <div className="flex items-center text-gray-400 opacity-0 group-hover:opacity-100 mr-2">
            <FaGripVertical />
          </div> */}
          <div className="flex-1 flex items-center">
            <span className="text-gray-800">{criteria.criteria}</span>
            {criteria.gameId && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Game-specific
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onStartEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit criteria"
            >
              <FaPen />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete criteria"
            >
              <FaTrashAlt />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default CriteriaItem;
