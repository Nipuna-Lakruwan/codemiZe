import React from 'react';
import { motion } from 'framer-motion';

export default function BuzzerComponent({ isDisabled, onBuzzerClick, hasAnswered, animateWhenDisabled = false }) {
  const buzzerVariants = {
    enabled: {
      scale: 1,
      boxShadow: "0px 0px 15px rgba(255, 0, 0, 0.7)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    disabled: {
      scale: animateWhenDisabled ? [1, 0.98, 1] : 1,
      opacity: 0.7,
      boxShadow: "0px 0px 5px rgba(255, 0, 0, 0.3)",
      transition: animateWhenDisabled ? {
        scale: {
          repeat: Infinity,
          duration: 2
        }
      } : {}
    },
    pressed: {
      scale: 0.95,
      boxShadow: "0px 0px 8px rgba(255, 0, 0, 0.5)"
    },
    answered: {
      scale: 1,
      opacity: 0.5,
      boxShadow: "0px 0px 5px rgba(0, 255, 0, 0.5)"
    }
  };

  return (
    <motion.button
      className={`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-red-600 text-white font-bold text-2xl sm:text-3xl md:text-4xl flex items-center justify-center border-4 border-red-700 relative ${hasAnswered ? 'bg-green-600 border-green-700' : isDisabled ? 'cursor-not-allowed' : 'hover:bg-red-700'}`}
      variants={buzzerVariants}
      initial="disabled"
      animate={hasAnswered ? "answered" : isDisabled ? "disabled" : "enabled"}
      whileTap={!isDisabled ? "pressed" : undefined}
      onClick={onBuzzerClick}
      disabled={isDisabled}
    >
      {/* Inner shadow effect */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-b from-transparent to-black/20"></div>

      {/* Highlight effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent h-1/2"></div>

      {/* Button text */}
      <span className="relative z-10">{hasAnswered ? 'ANSWERED' : 'BUZZER'}</span>

      {/* Pulse effect when active */}
      {!isDisabled && !hasAnswered && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
    </motion.button>
  );
}
