import React from 'react';
import virtual from "../static_2/virtual.png";
import "../styles/footer.css"
const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src={virtual}
            alt="Virtual Galaxy Logo"
            className="logo-image"
            height="60"
            width="140"
          />
        </div>
        <div className="footer-links">
          <a href="https://www.vgipl.com/conversational-ai-companion">Privacy Policy</a>
          <a href="https://www.vgipl.com/conversational-ai-companion">Terms of Service</a>
          <a href="https://www.vgipl.com/conversational-ai-companion">Contact Us</a>
        </div>
        <div className="footer-copyright">
          © 2025 Virtual Galaxy Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;