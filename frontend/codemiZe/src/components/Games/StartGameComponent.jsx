import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable component for game start screens
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the game
 * @param {string} props.iconSrc - Path to the game icon
 * @param {string} props.iconAlt - Alt text for the game icon
 * @param {Function} props.onStart - Function to call when start button is clicked
 * @param {string} props.buttonText - Text to display on the start button (defaults to "Start Game")
 * @param {Object} props.containerStyle - Additional styles for the container
 * @param {boolean} props.isLoading - Whether the game is in a loading state
 * @param {boolean} props.isDisabled - Whether the start button should be disabled
 * @param {string} props.topRightImageSrc - Image to show in top right
 * @param {string} props.bottomLeftImageSrc - Image to show in bottom left
 * @param {boolean} props.showScoreInfo - Whether to display score information
 * @param {string} props.scoreInfo - Information about the scoring system
 * @param {number} props.totalQuestions - Total number of questions in the quiz
 */
const StartGameComponent = ({
  title,
  iconSrc,
  iconAlt,
  onStart = () => { },
  buttonText = "Start Game",
  containerStyle = {},
  isLoading = false,
  isDisabled = false,
  topRightImageSrc = "/robot-assistant.png",
  bottomLeftImageSrc = "/rocket.png",
  showScoreInfo = false,
  scoreInfo = "",
  totalQuestions = 0
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgba(140, 20, 252, 0.6)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    },
    disabled: {
      opacity: 0.5,
      scale: 1
    }
  };

  const decorativeImageVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.7,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Top right decorative image */}
      <motion.div
        className="absolute top-4 right-8 sm:top-8 sm:right-8 md:top-12 md:right-16 lg:top-45 lg:right-130 z-10"
        variants={decorativeImageVariants}
        initial="hidden"
        animate={["visible", "float"]}
      >
        <img
          src={topRightImageSrc}
          alt="Decorative"
          className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-56 lg:h-44 object-contain"
        />
      </motion.div>

      {/* Bottom left decorative image */}
      <motion.div
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 lg:bottom-20 lg:left-110 z-30"
        variants={decorativeImageVariants}
        initial="hidden"
        animate={["visible", "float"]}
        style={{ animationDelay: "1s" }}
      >
        <img
          src={bottomLeftImageSrc}
          alt="Decorative"
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-80 lg:h-96 object-contain"
        />
      </motion.div>

      {/* Transparent glass box - with responsive sizing */}
      <motion.div
        className="w-full max-w-lg sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] h-auto aspect-[4/5] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={containerStyle}
      >
        {/* Game Icon - responsive sizing */}
        <motion.div
          className="relative w-[60%] sm:w-[45%] md:w-[50%] lg:w-[75%] aspect-square mb-4 sm:mb-6"
          variants={iconVariants}
          whileHover="hover"
        >
          <motion.img
            src={iconSrc}
            alt={iconAlt}
            className="w-full h-full object-contain"
            style={{ filter: isDisabled ? 'grayscale(0.5) opacity(0.7)' : 'none' }}
          />

          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </motion.div>

        {/* Game Name - responsive text */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-center"
          variants={textVariants}
        >
          {title}
        </motion.h2>

        {/* Score information - Only shown if showScoreInfo is true */}
        {showScoreInfo && (
          <motion.div
            className="bg-purple-950/30 rounded-lg px-4 py-3 mb-6 w-full max-w-xs border border-purple-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300 text-sm">Questions:</span>
              <span className="text-white font-medium">{totalQuestions}</span>
            </div>
            <div className="w-full h-[1px] bg-purple-500/20 mb-2"></div>
            <div className="text-white/80 text-sm text-center">
              {scoreInfo}
            </div>
          </motion.div>
        )}

        {/* Start Button - responsive width */}
        <motion.button
          className={`w-full max-w-xs h-10 sm:h-12 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white font-medium flex items-center justify-center ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover={!isDisabled ? "hover" : "disabled"}
          whileTap={!isDisabled ? "tap" : "disabled"}
          onClick={!isDisabled ? onStart : undefined}
          disabled={isDisabled}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartGameComponent;
