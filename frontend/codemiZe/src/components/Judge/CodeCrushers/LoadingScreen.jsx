import React from 'react';

const LoadingScreen = () => (
  <div className="w-full h-full flex flex-col items-center justify-center relative">
    <div className="absolute left-8 top-8">
      <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
        Code Crushers
      </div>
    </div>
    <div className="flex flex-col items-center justify-center flex-1">
      <img
        className="w-80 h-80"
        src="/loading.gif"
        alt="Loading"
      />
      <div className="justify-start text-sky-600 text-4xl font-bold mt-4" style={{ fontFamily: 'Jersey_25' }}>
        Loading...
      </div>
    </div>
  </div>
);

export default LoadingScreen;
