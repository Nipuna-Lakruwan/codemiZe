import React from 'react';

const CentralLogo = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
      <img
        src="/c-logo.png"
        alt="CodemiZe Central Logo"
        className="w-150 h-150 opacity-90"
      />
    </div>
  );
};

export default CentralLogo;
