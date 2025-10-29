// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/headerDash.css'; // Import the CSS file
// import vani from "../static_2/vani.png";
// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // onLogout(); // You can add your logout logic here
//     navigate('/');
//   };

//   return (
//     <header className="dashboard-header">
//       {/* Logo Section */}
//       <div className="header-logo">
      
//         <div className="brand-text">
//           <img src={vani} alt="hello" style={{height:"50px",width:"67px"}} />
      
//         </div>
//       </div>
      
//       {/* Navigation */}
//       <nav className="header-nav">
//         <a 
//           href="/dashboard/chat" 
//           className="nav-link"
//         >
//           <span className="nav-icon">💬</span>
//           <span className="nav-text">Chat</span>
//         </a>
//         <a 
//           href="/dashboard" 
//           className="nav-link"
//         >
//           <span className="nav-icon">📊</span>
//           <span className="nav-text">Dashboard</span>
//         </a>
//       </nav>
      
//       {/* User Section */}
//       <div className="header-user">
//         <div className="user-info">
//           <div className="user-avatar">U</div>
//           <span className="user-name">User</span>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="logout-btn"
//         >
//           <span className="logout-icon">🚪</span>
//           <span>Logout</span>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default DashboardHeader;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/headerDash.css';
import vani from "../static_2/vani.png";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="dashboard-header">
      {/* Animated Background Elements */}
      <div className="header-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
      </div>

      {/* Main Header Content */}
      <div className="header-content">
        {/* Logo Section with Enhanced Design */}
        <div className="header-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-orb">
            <div className="logo-orb-inner">
              <img src={vani} alt="Vani AI" className="logo-image" />
            </div>
            <div className="logo-orb-glow"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">Vani AI</span>
            <span className="brand-subtitle">Intelligent Voice Assistant</span>
          </div>
        </div>

        {/* Central Navigation with Hover Effects */}
        <nav className="header-nav">
          <div className="nav-container">
            <a 
              href="/dashboard/chat" 
              className="nav-item"
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.querySelector('.nav-glow').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.querySelector('.nav-glow').style.opacity = '0';
              }}
            >
              <div className="nav-glow"></div>
              <span className="nav-icon">💬</span>
              <span className="nav-text">Chat Interface</span>
              <div className="nav-pulse"></div>
            </a>
            
            <a 
              href="/dashboard" 
              className="nav-item active"
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.querySelector('.nav-glow').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.querySelector('.nav-glow').style.opacity = '0';
              }}
            >
              <div className="nav-glow"></div>
              <span className="nav-icon">📊</span>
              <span className="nav-text">Analytics Dashboard</span>
              <div className="nav-pulse active"></div>
            </a>
          </div>
        </nav>

        {/* User Section with Enhanced Interactions */}
        <div className="header-user">
          <div className="user-profile">
            <div className="user-avatar-container">
              <div className="user-avatar">
                <span>U</span>
              </div>
              <div className="avatar-ring"></div>
              <div className="status-indicator"></div>
            </div>
            
            <div className="user-info">
              <span className="user-name">User Profile</span>
              <span className="user-role">Premium Member</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="logout-btn"
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(4px)';
              e.target.querySelector('.logout-sparkle').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.querySelector('.logout-sparkle').style.opacity = '0';
            }}
          >
            <div className="logout-sparkle"></div>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="/dashboard/chat" className="mobile-nav-item">
          <span className="nav-icon">💬</span>
          <span>Chat Interface</span>
        </a>
        <a href="/dashboard" className="mobile-nav-item">
          <span className="nav-icon">📊</span>
          <span>Analytics Dashboard</span>
        </a>
        <button onClick={handleLogout} className="mobile-logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;