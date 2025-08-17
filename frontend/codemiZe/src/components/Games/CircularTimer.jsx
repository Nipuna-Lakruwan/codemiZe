import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CircularTimer = ({ timeRemaining, totalTime }) => {
  // Internal state to ensure smooth animations even if props update irregularly
  const [internalTime, setInternalTime] = useState(timeRemaining);

  // Update internal time when prop changes
  useEffect(() => {
    setInternalTime(timeRemaining);
  }, [timeRemaining]);

  // Calculate percentage of time remaining
  const percentage = Math.max(0, Math.min(100, (internalTime / totalTime) * 100));

  // Calculate circle properties - increased radius for bigger timer
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  // Format time as MM:SS
  const minutes = Math.floor(internalTime / 60);
  const seconds = Math.floor(internalTime % 60);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Dynamic colors based on remaining time percentage
  const getColor = () => {
    if (percentage > 66) return '#22c55e'; // Green
    if (percentage > 33) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  // Pulse effect increases as time runs out
  const pulseEffect = internalTime <= 10 ?
    { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.8 } } :
    {};

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG for circular timer - increased size */}
      <svg width="400" height="400" viewBox="0 0 400 400">
        {/* Background circle */}
        <circle
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="18"
          opacity="0.2"
        />

        {/* Timer progress circle with animation */}
        <motion.circle
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 200 200)"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />

        {/* Optional: Add glow effect when time is low */}
        {internalTime <= 10 && (
          <motion.circle
            cx="200"
            cy="200"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 200 200)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            filter="blur(12px)"
          />
        )}
      </svg>

      {/* Time display in center */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        {...pulseEffect}
      >
        <motion.div
          className="text-8xl font-bold font-['Oxanium'] drop-shadow-lg"
          style={{ color: getColor() }}
          animate={{
            color: getColor(),
            scale: internalTime <= 5 ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: internalTime <= 5 ? 0.5 : 0.3,
            repeat: internalTime <= 5 ? Infinity : 0
          }}
        >
          {formattedTime}
        </motion.div>
        <div className="text-2xl text-white/80 mt-3 font-['Inter'] drop-shadow-md">
          remaining
        </div>
      </motion.div>
    </div>
  );
};

export default CircularTimer;
