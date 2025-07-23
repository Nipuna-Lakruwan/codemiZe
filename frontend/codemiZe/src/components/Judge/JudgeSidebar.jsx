import React from 'react';
import { NavLink } from 'react-router-dom';

const JudgeSidebar = ({ currentPage = 'Judge Dashboard' }) => {
  // Define navigation items for the judge portal
  const navItems = [
    { title: 'Quiz Hunters', path: '/judge/quiz-hunters' },
    { title: 'Code Crushers', path: '/judge/code-crushers' },
    { title: 'Circuit Smashers', path: '/judge/circuit-smashers' },
    { title: 'Route Seekers', path: '/judge/route-seekers' },
    { title: 'Battle Breakers', path: '/judge/battle-breakers' }
  ];

  // Theme color for active links - purple as specified
  const themeColor = 'rgba(62, 5, 128, 1)';

  return (
    <div className="h-full flex flex-col bg-stone-200/5 rounded-lg border-l-2 border border-l-[rgba(62,5,128,0.7)] border-white/5 backdrop-blur-[5.90px] shadow-[0px_0px_34px_8px_rgba(104,104,104,0.22)]">
      {/* Dashboard link */}
      <div className="px-4 py-4 border-b border-white/10">
        <NavLink
          to="/judge/dashboard"
          className={({ isActive }) => `
            flex items-center justify-center py-3 px-4 rounded-md transition-all duration-300 
            ${isActive || currentPage === 'Judge Dashboard'
              ? `text-white font-medium bg-[${themeColor}] shadow-[0_0_15px_rgba(62,5,128,0.6)]`
              : 'text-white/90 hover:text-white hover:bg-white/10'
            }
          `}
        >
          {({ isActive }) => (
            <span className="text-lg font-semibold">
              {currentPage === 'Judge Dashboard' && (
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              )}
              <span className={(isActive || currentPage === 'Judge Dashboard') ? 'border-b-2 border-white pb-1' : ''}>
                Judge Dashboard
              </span>
            </span>
          )}
        </NavLink>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col h-full p-5">
        <div className="mb-4 px-2 font-medium flex items-center">
          <span className="w-2 h-4 bg-[rgba(62,5,128,1)] rounded-sm mr-2"></span>
          <span className="text-white/80 text-sm">Games to Judge</span>
        </div>
        {navItems.map((item, index) => {
          // Check if this is the current page based on the title
          const isCurrentPage = currentPage.includes(item.title);

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                py-3 px-5 mb-4 rounded-md transition-all duration-300 border
                ${isActive || isCurrentPage
                  ? `text-white font-medium bg-[${themeColor}] border-[${themeColor}] shadow-[0_0_15px_rgba(62,5,128,0.6)]`
                  : 'border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-[${themeColor}]/50'
                }
              `}
            >
              {({ isActive }) => (
                <div className="flex items-center">
                  {isCurrentPage && (
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  )}
                  <span className={(isActive || isCurrentPage) ? 'relative' : ''}>
                    {item.title}
                    {(isActive || isCurrentPage) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded"></span>
                    )}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer with logout */}
      <div className="mt-auto p-5 border-t border-white/10">
        <button
          className="w-full py-3 px-5 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-center transition-all font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default JudgeSidebar;
