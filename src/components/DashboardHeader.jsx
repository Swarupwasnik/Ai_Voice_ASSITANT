import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="w-full h-[70px] bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-8 border-b border-gray-200 relative z-[1001]">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          AI
        </div>
        <h1 className="text-green-500 text-2xl font-bold" style={{ color: '#10b981' }}>
          Dashboard
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex space-x-8">
        <a href="/dashboard/chat" className="text-white hover:text-blue-200 transition-colors">
          💬 Chat
        </a>
        <a href="/dashboard" className="text-white hover:text-blue-200 transition-colors">
          📊 Dashboard
        </a>
      </nav>
      
      {/* User Section */}
      <div className="flex items-center space-x-4">
        <span className="text-white font-medium">{user?.name || 'User'}</span>
        <button 
          onClick={handleLogout}
          className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;