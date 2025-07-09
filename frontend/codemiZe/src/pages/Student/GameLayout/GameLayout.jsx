import React from 'react';

export default function GameLayout({ children }) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden flex flex-col"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      {/* Central c-logo */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src="/c-logo.png"
          alt="CodemiZe Central Logo"
          className="w-150 h-150 opacity-90"
        />
      </div>
      {/* Title image in top right */}
      <div className="absolute top-6 right-8 z-20">
        <img
          src="/title2.png"
          alt="CodemiZe"
          className="h-14 w-auto"
        />
      </div>
      {/* Main content */}
      <div className="relative z-30 flex flex-col flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}
