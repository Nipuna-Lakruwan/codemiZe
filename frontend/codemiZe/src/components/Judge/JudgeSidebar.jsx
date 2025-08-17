import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const navItems = [
  { title: 'Quiz Hunters', path: '/judge/quiz-hunters' },
  { title: 'Code Crushers', path: '/judge/code-crushers' },
  { title: 'Circuit Smashers', path: '/judge/circuit-smashers' },
  { title: 'Route Seekers', path: '/judge/route-seekers' },
  { title: 'Battle Breakers', path: '/judge/battle-breakers' }
];

const themeColor = 'rgba(62, 5, 128, 1)';

const JudgeSidebar = ({ currentPage = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    navigate('/');
  };

  return (
    <div className="w-70 h-[800px] bg-black/5 rounded-tr-[19px] shadow-[0px_4px_37.099998474121094px_1px_rgba(73,18,136,0.68)] border border-violet-900/70 backdrop-blur-[5.40px] flex flex-col py-9 px-4">
      {/* Navigation items */}
      <nav className="flex flex-col gap-8 mt-16">
        {navItems.map((item) => {
          // Check if the current path starts with the item's path
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={`w-full rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 border
                ${isActive
                  ? 'bg-[rgba(62,5,128,1)] text-white border-[rgba(62,5,128,1)] shadow-[0_0_15px_rgba(62,5,128,0.6)]'
                  : 'bg-white text-violet-900 border-white hover:bg-violet-50 hover:text-violet-900'
                }`}
              style={isActive ? { fontWeight: 600 } : {}}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer with logout */}
      <div className="mt-auto p-5 border-t border-white/10">
        <button
          className="w-full py-3 px-5 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-center transition-all font-medium"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default JudgeSidebar;