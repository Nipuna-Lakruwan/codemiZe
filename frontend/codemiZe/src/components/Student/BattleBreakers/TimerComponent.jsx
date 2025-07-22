import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TimerComponent({ totalTime, timeLeft, isPaused = false }) {
  const [progressWidth, setProgressWidth] = useState(100);

  // Calculate percentage of time left
  useEffect(() => {
    if (totalTime > 0) {
      const percentage = (timeLeft / totalTime) * 100;
      setProgressWidth(percentage);
    }
  }, [timeLeft, totalTime]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine color based on time left
  const getColor = () => {
    if (progressWidth > 60) return 'bg-green-500';
    if (progressWidth > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Timer display */}
      <motion.div
        className="text-center text-2xl sm:text-3xl font-bold mb-2 text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isPaused ? [1, 1.05, 1] : 1
        }}
        transition={isPaused ? {
          scale: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }
        } : {}}
      >
        {formatTime(timeLeft)}
        {isPaused && <span className="ml-2 text-yellow-300">(Paused)</span>}
      </motion.div>

      {/* Progress bar container */}
      <div className="h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden">
        {/* Animated progress bar */}
        <motion.div
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: '100%' }}
          animate={{
            width: `${progressWidth}%`,
          }}
          transition={{
            duration: isPaused ? 0 : 0.3,
            ease: "linear"
          }}
        >
          {/* Shimmer effect */}
          <div className="w-full h-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.5
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Warning pulse when time is low */}
      {progressWidth <= 20 && !isPaused && (
        <motion.div
          className="mt-2 text-center text-red-500 font-bold"
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Time is running out!
        </motion.div>
      )}
    </div>
  );
}
