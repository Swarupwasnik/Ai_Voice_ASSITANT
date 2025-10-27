import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import Sidebar from './Sidebar';
import '../styles/sidebar.css';

const DashboardLayout = ({ children, user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className={`dashboard-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <DashboardHeader user={user} onLogout={onLogout} />
        <main className="main-content">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;