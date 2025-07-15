import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation items
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Marking Criterias', path: '/admin/marking-criterias' },
    { name: 'Quiz Hunters', path: '/admin/quiz-hunters' },
    { name: 'Code Crushers', path: '/admin/code-crushers' },
    { name: 'Circuit Smashers', path: '/admin/circuit-smashers' },
    { name: 'Route Seekers', path: '/admin/route-seekers' },
    { name: 'Battle Breakers', path: '/admin/battle-breakers' },
    { name: 'User Management', path: '/admin/user-management' },
  ];

  // Handle logouthandleLogout
  const handleLogout = async () => {
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    console.log('Logout clicked');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "rgba(240, 240, 245, 1)" }}>
      {/* Campus logo in white rectangle in the page's top right corner */}
      <div className="fixed top-0 right-0 z-50 bg-white rounded-bl-2xl p-4 shadow-lg">
        <img src="/campus-logo.png" alt="Campus Logo" className="h-20 w-auto" />
      </div>
      {/* Left navigation sidebar */}
      <div className="w-24 md:w-64 h-full min-h-screen bg-white flex flex-col shadow-lg overflow-hidden justify-between py-6 px-4">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/left-sidebar-img.png"
            alt="CodemiZe Logo"
            className="w-auto h-32 object-contain"
          />
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col space-y-4 mt-4 overflow-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={item.path}
                  className={`text-sm px-4 py-3 rounded-full transition-all duration-300 ease-in-out text-center block ${isActive
                      ? "bg-purple-800 text-white font-medium shadow"
                      : "text-purple-800 hover:text-purple-800 hover:bg-purple-50"
                    }`}
                >
                  {item.name}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Show Winners button */}
        <div className="mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/winners')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-300"
          >
            Show Winners
          </motion.button>
        </div>
        {/* Show Winners button */}
        <div className="mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-300"
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 md:p-10 flex justify-center">
        <div className="w-full max-w-[1200px]">
          {children}
        </div>
      </div>
    </div>
  );
}
