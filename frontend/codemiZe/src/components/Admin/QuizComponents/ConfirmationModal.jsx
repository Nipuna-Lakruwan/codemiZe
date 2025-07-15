import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', or 'info'
}) => {
  if (!isOpen) return null;

  // Color based on type
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          button: 'bg-amber-500 hover:bg-amber-600'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          icon: 'text-purple-800',
          button: 'bg-purple-800 hover:bg-purple-900'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-[400px] shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaExclamationTriangle className={colors.icon} />
            {title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </motion.button>
        </div>

        <div className="w-full h-0 outline-2 outline-offset-[-1px] outline-purple-800 my-4"></div>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 ${colors.button} text-white rounded-md`}
          >
            {confirmText}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
