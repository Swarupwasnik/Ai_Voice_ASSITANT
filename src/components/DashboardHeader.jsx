import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/headerDash.css'; // Import the CSS file

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // onLogout(); // You can add your logout logic here
    navigate('/');
  };

  return (
    <header className="dashboard-header">
      {/* Logo Section */}
      <div className="header-logo">
        <div className="logo-container">
          <div className="logo-inner">
            <span className="logo-text">AI</span>
          </div>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">Dashboard</h1>
          <span className="brand-subtitle">AI POWERED PLATFORM</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="header-nav">
        <a 
          href="/dashboard/chat" 
          className="nav-link"
        >
          <span className="nav-icon">💬</span>
          <span className="nav-text">Chat</span>
        </a>
        <a 
          href="/dashboard" 
          className="nav-link"
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </a>
      </nav>
      
      {/* User Section */}
      <div className="header-user">
        <div className="user-info">
          <div className="user-avatar">U</div>
          <span className="user-name">User</span>
        </div>
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;