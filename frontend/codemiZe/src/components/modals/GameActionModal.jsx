import React from 'react';
import { motion } from 'framer-motion';

const GameActionModal = ({ show, onClose, game }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-[400px] shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">{game.name}</h3>
        <div className="mb-4">
          <p>Current status: <span className="font-medium">{game.status}</span></p>
          <p className="text-sm text-gray-600 mt-2">
            Select an action to change the game status.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            className="py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => onClose('activate')}
          >
            Activate
          </button>
          <button
            className="py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => onClose('deactivate')}
          >
            Deactivate
          </button>
          <button
            className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onClose('complete')}
          >
            Mark as Complete
          </button>
          <button
            className="py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => onClose('cancel')}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameActionModal;
