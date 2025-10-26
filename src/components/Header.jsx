import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Vani from "../static_2/vani.png";
import "../styles/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    closeMenu();
  };

  const handleHome = () => {
    navigate('/');
    closeMenu();
  };

  return (
    <header className="main-header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="logo-section">
          <img
            src={Vani}
            alt="Virtual Galaxy Logo"
            className="logo-image"
            height="42"
            width="80"
          />
        </div>
        
        {/* Navigation Menu */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" onClick={handleHome} className="nav-link">
            <i className="fas fa-home"></i> 
            <span className="nav-text">Home</span>
          </a>
          <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu} className="nav-link">
            <i className="fas fa-phone-alt"></i> 
            <span className="nav-text">Contact</span>
          </a>
          <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu} className="nav-link">
            <i className="fas fa-info-circle"></i> 
            <span className="nav-text">About</span>
          </a>
        </nav>
        
        {/* Header Actions */}
        <div className="header-actions">
          <button className="btn-support">
            <a href="https://www.vgipl.com/conversational-ai-companion">
              <i className="fas fa-headset"></i> 
              <span className="btn-text">Support</span> 
            </a>
          </button>
          
          <button className="btn-login" onClick={handleLogin}>
            <i className="fas fa-sign-in-alt"></i>
            <span className="btn-text">Login</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="hamburger-menu" 
          onClick={toggleMenu}
        >
          <div className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img
                src={Vani}
                alt="Virtual Galaxy Logo"
                className="mobile-logo"
                height="40"
                width="70"
              />
              <button className="close-menu" onClick={closeMenu}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mobile-nav-links">
              <a href="/" onClick={handleHome} className="mobile-nav-link">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
              <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu} className="mobile-nav-link">
                <i className="fas fa-phone-alt"></i>
                <span>Contact</span>
              </a>
              <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu} className="mobile-nav-link">
                <i className="fas fa-info-circle"></i>
                <span>About</span>
              </a>
            </div>
            
            <div className="mobile-actions">
              <button className="btn-support mobile-btn">
                <a href="https://www.vgipl.com/conversational-ai-companion">
                  <i className="fas fa-headset"></i>
                  <span>Support</span>
                </a>
              </button>
              
              <button className="btn-login mobile-btn" onClick={handleLogin}>
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
// import React, { useState } from 'react';
// import Vani from "../static_2/vani.png";
// import "../styles/header.css";
// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   return (
//     <header className="main-header">
//       <div className="header-content">
//         <div className="logo-section">
//           <img
//             src={Vani}
//             alt="Virtual Galaxy Logo"
//             className="logo-image"
//             height="60"
//             width="100"
//           />
//         </div>
        
//         <button 
//           className="hamburger-menu" 
//           id="hamburger-menu"
//           onClick={toggleMenu}
//         >
//           <i className="fas fa-bars"></i>
//         </button>
        
//         <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
//           <a href="/" onClick={closeMenu}><i className="fas fa-home"></i> Home</a>
//           <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu}>
//             <i className="fas fa-phone-alt"></i> Contact
//           </a>
//           <a href="https://www.vgipl.com/conversational-ai-companion" onClick={closeMenu}>
//             <i className="fas fa-info-circle"></i> About
//           </a>
//         </nav>
        
//         <div className="header-actions">
//           <button className="btn-support">
//             <a href="https://www.vgipl.com/conversational-ai-companion">
//               <i className="fas fa-headset"></i> <span>Support</span> 
//             </a>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;