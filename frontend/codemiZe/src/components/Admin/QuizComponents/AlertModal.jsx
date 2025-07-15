import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaInfoCircle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message = 'This is an alert message.',
  buttonText = 'Okay',
  type = 'info', // 'info', 'success', 'warning', or 'error'
  autoClose = false,
  autoCloseTime = 3000 // 3 seconds
}) => {
  useEffect(() => {
    let timer;
    if (isOpen && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  // Icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-600 text-2xl" />,
          styles: 'border-l-4 border-green-600',
          buttonClass: 'bg-green-600 hover:bg-green-700'
        };
      case 'warning':
        return {
          icon: <FaExclamationCircle className="text-amber-500 text-2xl" />,
          styles: 'border-l-4 border-amber-500',
          buttonClass: 'bg-amber-500 hover:bg-amber-600'
        };
      case 'error':
        return {
          icon: <FaExclamationCircle className="text-red-600 text-2xl" />,
          styles: 'border-l-4 border-red-600',
          buttonClass: 'bg-red-600 hover:bg-red-700'
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-purple-800 text-2xl" />,
          styles: 'border-l-4 border-purple-800',
          buttonClass: 'bg-purple-800 hover:bg-purple-900'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-white rounded-lg p-6 w-[400px] shadow-xl ${config.styles}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-3">
            {config.icon}
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

        <div className="py-2 px-1 mb-5 text-gray-700">
          {message}
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`px-5 py-2 text-white rounded-md ${config.buttonClass}`}
          >
            {buttonText}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertModal;
