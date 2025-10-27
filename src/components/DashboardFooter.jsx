import React from 'react';
import virtual from "../static_2/virtual.png";
import "../styles/footer.css";
import "../styles/dashboard-footer.css";

const DashboardFooter = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src={virtual}
            alt="Virtual Galaxy Logo"
            className="logo-image"
            height="30"
            width="80"
          />
        </div>
        <div className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/chat">Chat</a>
          <a href="/settings">Settings</a>
        </div>
        <div className="footer-copyright">
          © 2025 Virtual Galaxy Ltd.
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;