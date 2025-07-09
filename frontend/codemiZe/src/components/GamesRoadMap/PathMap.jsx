import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PathMap = ({ paths, visiblePaths, containerSize, themeColorLight }) => {
  return (
    <div className="absolute inset-0 w-full h-full z-[8]">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {paths.map((path, index) => (
          <AnimatePresence key={`path-${index}`}>
            {visiblePaths.includes(index) && (
              <g>
                {/* Path glow effect */}
                <motion.path
                  d={`M ${path.start.x} ${path.start.y} Q ${path.control.x} ${path.control.y} ${path.end.x} ${path.end.y}`}
                  stroke={path.isAvailable ? "rgba(140, 20, 252, 0.2)" : "rgba(255,255,255,0.15)"}
                  strokeWidth="20" // Thicker for better glow
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      duration: 1.2,
                      ease: "easeInOut",
                    }
                  }}
                />

                {/* Main path with stronger visibility and animation */}
                <motion.path
                  d={`M ${path.start.x} ${path.start.y} Q ${path.control.x} ${path.control.y} ${path.end.x} ${path.end.y}`}
                  stroke={path.isAvailable ? themeColorLight : "rgba(255,255,255,0.5)"}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="12,12"
                  strokeLinecap="round"
                  style={{
                    filter: path.isAvailable
                      ? 'drop-shadow(0 0 10px rgba(140, 20, 252, 0.6))'
                      : 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
                  }}
                  className="animate-dash"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0.1
                    }
                  }}
                />

                {/* Start point circle */}
                <motion.circle
                  cx={path.start.x}
                  cy={path.start.y}
                  r="10" // Larger dots
                  fill={path.isAvailable ? themeColorLight : "rgba(255,255,255,0.5)"}
                  style={{
                    filter: path.isAvailable
                      ? 'drop-shadow(0 0 12px rgba(140, 20, 252, 0.8))'
                      : 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      ease: "backOut"
                    }
                  }}
                />

                {/* End point circle */}
                <motion.circle
                  cx={path.end.x}
                  cy={path.end.y}
                  r="10" // Larger dots
                  fill={path.isAvailable ? themeColorLight : "rgba(255,255,255,0.5)"}
                  style={{
                    filter: path.isAvailable
                      ? 'drop-shadow(0 0 12px rgba(140, 20, 252, 0.8))'
                      : 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      ease: "backOut",
                      delay: 0.7
                    }
                  }}
                />
              </g>
            )}
          </AnimatePresence>
        ))}
      </svg>
    </div>
  );
};

export default PathMap;
