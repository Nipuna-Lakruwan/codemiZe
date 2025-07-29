import React from 'react';
import JudgeSidebar from '../../components/Judge/JudgeSidebar';

const JudgeLayout = ({ children, gameName = "Judge Board" }) => {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden flex"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src="/c-logo.png"
          alt="CodemiZe Central Logo"
          className="w-150 h-150 opacity-90"
        />
      </div>
      <div className="absolute top-0 left-0 z-20 bg-white rounded-br-lg p-3 shadow-md">
        <img
          src="/campus-logo.png"
          alt="Campus Logo"
          className="h-16 w-auto"
        />
      </div>
      <div className="absolute top-4 right-6 z-20">
        <img
          src="/login-title.png"
          alt="CodemiZe"
          className="h-20 w-auto"
        />
      </div>
      <div className="relative z-30 w-56 h-[900px] mt-70">
        <JudgeSidebar currentPage={gameName} />
      </div>
      <div className="relative z-30 flex-1 flex items-center justify-center">
        <div className="relative w-[1220px] h-[900px] flex items-center justify-center mt-15">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[880px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] z-0" />
          <div className="relative w-[1140px] h-[830px] bg-white rounded-md mx-auto flex items-center justify-center z-10 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeLayout;