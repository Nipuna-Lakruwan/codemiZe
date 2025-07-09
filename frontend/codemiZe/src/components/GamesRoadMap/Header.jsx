import React from 'react';

const Header = () => {
  return (
    <div className="z-10 relative pt-8 pb-4 flex items-center gap-4 justify-center">
      <img
        src="/title2.png"
        alt="CodemiZe"
        className="h-16 w-auto"
      />
      <span className="text-white h-2 text-4xl font-normal font-['Jersey_25']">
        Road Map
      </span>
    </div>
  );
};

export default Header;
