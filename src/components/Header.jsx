import React, { useState } from 'react';
import Vani from "../static_2/vani.png";
import "../styles/header.css";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-section">
          <img
            src={Vani}
            alt="Virtual Galaxy Logo"
            className="logo-image"
            height="60"
            width="100"
          />
        </div>
        
        <button 
          className="hamburger-menu" 
          id="hamburger-menu"
          onClick={toggleMenu}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" onClick={closeMenu}><i className="fas fa-home"></i> Home</a>
          <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu}>
            <i className="fas fa-phone-alt"></i> Contact
          </a>
          <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu}>
            <i className="fas fa-info-circle"></i> About
          </a>
        </nav>
        
        <div className="header-actions">
          <button className="btn-support">
            <a href="https://www.vgipl.com/conversational-ai-companion">
              <i className="fas fa-headset"></i> <span>Support</span> 
            </a>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;