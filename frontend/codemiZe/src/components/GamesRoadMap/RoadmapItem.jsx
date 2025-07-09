import { useState } from 'react';

function RoadmapItem({
  title,
  image,
  isActive,
  isCompleted,
  onClick,
  position,
  totalItems,
  // New positioning props
  customStyles = {},
  outlineColor = "rgba(255,255,255,0.3)",
  outlineWidth = 1,
  outlineStyle = "solid"
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine status class based on completion
  const statusClass = isCompleted
    ? "bg-[rgba(62,5,128,1)]"
    : isActive
      ? "bg-[rgba(62,5,128,0.7)]"
      : "bg-white/20";

  // Determine if this item is at the start, middle or end
  const isFirst = position === 0;
  const isLast = position === totalItems - 1;

  // Outline styles based on props
  const outlineStyles = {
    borderColor: outlineColor,
    borderWidth: `${outlineWidth}px`,
    borderStyle: outlineStyle
  };

  return (
    <div
      className="roadmap-item mx-3 md:mx-6"
      style={{
        zIndex: isActive ? 20 : 10,
        ...customStyles // Apply any custom positioning styles
      }}
    >
      <div
        className={`glass-container rounded-lg p-5 ${isActive ? 'scale-110' : ''} transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          minWidth: '180px',
          maxWidth: '180px',
          ...outlineStyles // Apply outline styles
        }}
      >
        {/* Horizontal connectors - now customizable */}
        {!isFirst && (
          <div
            className="absolute top-1/2 -left-6 w-6 h-1 -translate-y-1/2 hidden md:block"
            style={{ backgroundColor: outlineColor }}
          ></div>
        )}
        {!isLast && (
          <div
            className="absolute top-1/2 -right-6 w-6 h-1 -translate-y-1/2 hidden md:block"
            style={{ backgroundColor: outlineColor }}
          ></div>
        )}

        {/* 3D Button container */}
        <div
          className={`button-3d-container relative mx-auto w-24 h-24 mb-2 cursor-pointer ${isActive ? 'active' : ''}`}
          onClick={onClick}
        >
          {/* Button shadow (for 3D effect) */}
          <div className="absolute inset-0 rounded-full bg-black/50 transform translate-y-2 blur-md"></div>

          {/* Button base (3D effect) */}
          <div className="button-base absolute inset-0 rounded-full bg-stone-800/90 backdrop-blur-sm border border-white/10 transform translate-y-1.5"></div>

          {/* Button middle layer */}
          <div className="button-middle absolute inset-0 rounded-full bg-stone-500/20 transform translate-y-0.5"></div>

          {/* Button top (animated part) */}
          <div
            className={`button-top absolute inset-0 rounded-full ${statusClass} transition-all duration-300 flex items-center justify-center transform ${isActive || isHovered ? 'translate-y-[-4px]' : 'translate-y-0'}`}
            style={{
              boxShadow: isActive ? '0 6px 12px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            <img
              src={image}
              alt={title}
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <h3 className="text-base font-medium text-white text-center mt-2">{title}</h3>

        <div className={`status-indicator w-4 h-4 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-white/30'} mx-auto mt-2 shadow-glow`}></div>
      </div>
    </div>
  );
}

export default RoadmapItem;
