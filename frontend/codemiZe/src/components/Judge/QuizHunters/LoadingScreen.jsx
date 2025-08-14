import React from 'react';

const LoadingScreen = () => (
  <div className="w-full h-full flex flex-col items-center justify-center relative">
    <div className="absolute left-8 top-8">
    </div>
    <div className="flex flex-col items-center justify-center flex-1">
      <img
        className="w-80 h-80"
        src="/loading.gif"
        alt="Loading"
      />
      <div className="justify-start text-sky-600 text-4xl font-bold mt-4" style={{ fontFamily: 'Jersey_25' }}>
        Waiting For Results
      </div>
    </div>
  </div>
);

export default LoadingScreen;
