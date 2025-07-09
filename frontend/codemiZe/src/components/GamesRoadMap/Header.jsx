import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication status and redirect to login
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="z-10 relative pt-8 pb-4 flex items-center justify-between w-full px-8">
      {/* Empty div to maintain space on left side */}
      <div className="w-40"></div>

      {/* Centered title and roadmap */}
      <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/title2.png"
          alt="CodemiZe"
          className="h-16 w-auto"
        />
        <span className="text-white h-2 text-4xl font-normal font-['Jersey_25']">
          Road Map
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-stone-200/10 hover:bg-stone-200/20 rounded-md border border-white/10 text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm1 7a1 1 0 100-2H7a1 1 0 100 2h4z" clipRule="evenodd" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Header;
