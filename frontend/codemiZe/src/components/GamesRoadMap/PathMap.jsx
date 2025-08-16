import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import line1Image from '/line1.png'; // Import the line image from public folder
import line2Image from '/line2.png'; // Import the second line image
import line3Image from '/line3.png'; // Import the third line image
import line4Image from '/line4.png'; // Import the fourth line image
import line5Image from '/line5.png'; // Import the fifth line image

// Define a component for the custom line image
const LineImage = ({ path, position, rotation, scale, isVisible, imageName }) => {
  // Calculate the midpoint of the path to position the line image
  const midX = position?.x || (path.start.x + path.end.x) / 2;
  const midY = position?.y || (path.start.y + path.end.y) / 2;

  // Calculate angle for rotation if not provided
  const autoRotation = Math.atan2(path.end.y - path.start.y, path.end.x - path.start.x) * (180 / Math.PI);
  const imageRotation = rotation !== undefined ? rotation : autoRotation;

  // Default scale or custom scale
  const imageScale = scale || { width: 100, height: 90 };

  // Select the appropriate image based on imageName
  const getImage = () => {
    switch (imageName) {
      case 'line2':
        return line2Image;
      case 'line5':
        return line5Image;
      case 'line3':
        return line3Image;
      case 'line4':
        return line4Image;
      case 'line1':
      default:
        return line1Image;
    }
  };

  return (
    <g transform={`rotate(${imageRotation}, ${midX}, ${midY})`}>
      <motion.image
        xlinkHref={getImage()}
        x={midX - imageScale.width / 2}
        y={midY - imageScale.height / 2}
        width={imageScale.width}
        height={imageScale.height}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 0.8 : 0,
          scale: isVisible ? 1 : 0,
          transition: { duration: 0.7, ease: "easeInOut" }
        }}
        style={{
          filter: 'brightness(0.9)'
        }}
      />
    </g>
  );
};

const PathMap = ({ paths, visiblePaths, containerSize, themeColorLight, lineImages = [] }) => {
  return (
    <div className="absolute inset-0 w-full h-full z-[1]">
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
                {/* Custom line image if specified for this path */}
                {(path.useLineImage || lineImages.some(img => img.pathIndex === index)) && (
                  <LineImage
                    path={path}
                    position={lineImages.find(img => img.pathIndex === index)?.position}
                    rotation={lineImages.find(img => img.pathIndex === index)?.rotation}
                    scale={lineImages.find(img => img.pathIndex === index)?.scale}
                    imageName={lineImages.find(img => img.pathIndex === index)?.imageName || 'line1'}
                    isVisible={visiblePaths.includes(index)}
                  />
                )}
              </g>
            )}
          </AnimatePresence>
        ))}
      </svg>
    </div>
  );
};

export default PathMap;
