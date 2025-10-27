import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/dashboard/chat', icon: 'fas fa-comments', label: 'Chat' },
    { path: '/history', icon: 'fas fa-history', label: 'Call History' },
    { path: '/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={onToggle}>
          <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
            title={isCollapsed ? item.label : ''}
          >
            <i className={item.icon}></i>
            {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;