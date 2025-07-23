import React from 'react';
import JudgeSidebar from '../../components/Judge/JudgeSidebar';

const JudgeLayout = ({ children, gameName = "Judge Board" }) => {
  // Theme color - purple as requested
  const themeColor = 'rgba(62, 5, 128, 1)';

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden flex"
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

      {/* Campus logo box in top left corner - white rectangle as in login page */}
      <div className="absolute top-0 left-0 z-20 bg-white rounded-br-lg p-3 shadow-md">
        <img
          src="/campus-logo.png"
          alt="Campus Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Title image in top right */}
      <div className="absolute top-4 right-6 z-20">
        <img
          src="/login-title.png"
          alt="CodemiZe"
          className="h-20 w-auto"
        />
      </div>

      {/* Left sidebar - with additional space at top to match main content */}
      <div className="relative z-30 w-64 h-[calc(100vh-180px)] mt-45">
        <JudgeSidebar currentPage={gameName} />
      </div>

      {/* Main content area - more compact and comfortable */}
      <div className="relative z-30 flex-1 p-20 mt-3 mr-6">
        {/* Transparent outer rectangle with backdrop blur - more compact */}
        <div className="bg-stone-200/5 rounded-lg border border-white/5 backdrop-blur-[5.90px] shadow-[0px_0px_34px_8px_rgba(104,104,104,0.22)] w-full h-[calc(100vh-120px)] p-5">
          {/* White inner rectangle - smaller padding for comfort */}
          <div className="bg-white rounded-lg w-full h-full p-3 relative">
            {/* Game name in the top left */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h1 className="text-2xl font-bold" style={{ color: themeColor }}>{gameName}</h1>

              {/* Loading animation gif as requested */}
              <div>
                <img src="/loading.gif" alt="Loading" className="h-10 w-auto" />
              </div>
            </div>

            {/* Main content - adjusted height for comfort */}
            <div className="mt-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeLayout;
