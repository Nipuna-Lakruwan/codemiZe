import React from 'react';
import { motion } from 'framer-motion';

/**
 * A miniature version of GameNode for use within game pages
 * - Simplified version with just button, polygon and icon
 * - Non-interactive display element
 */
const GameNodeMini = ({ title, icon }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Slow flip animation for the icon
  const iconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.5
      }
    },
    slowFlip: {
      rotateY: [0, 360],
      transition: {
        duration: 10, // Very slow rotation
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 5 // Long delay between flips
      }
    }
  };

  // No animation for the gradient
  const staticGradientVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.3
      }
    }
  };

  return (
    <motion.div
      className="absolute left-10 bottom-8 z-40 cursor-default" // Changed cursor to default
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative flex flex-col items-center">
        {/* Triangle gradient above button with game icon - no animation */}
        <div className="relative mb-[-15px] left-[-1px]">
          <motion.div
            variants={staticGradientVariants}
            animate="visible"
            className="relative flex items-center justify-center"
          >
            <motion.img
              src="/Polygon 1.png"
              alt="Triangle"
              className="w-50 h-50 object-contain"
              style={{
                filter: 'drop-shadow(0 0 5px rgba(140, 20, 252, 0.6))'
              }}
            />

            {/* Game icon on top of triangle with slow flip */}
            <motion.img
              src={icon}
              alt={title}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-50 h-16 object-contain"
              variants={iconVariants}
              animate={["visible", "slowFlip"]}
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))'
              }}
            />
          </motion.div>
        </div>

        {/* Button below the triangle - not clickable */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          variants={buttonVariants}
        >
          <div className="relative w-40 h-14 flex items-center justify-center">
            <img
              src="/btn.svg"
              alt="Game Button"
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(140, 20, 252, 0.5))'
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameNodeMini;