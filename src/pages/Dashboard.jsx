import React from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <h1>Welcome to Dashboard</h1>
        <p>Manage your AI voice assistant and view analytics</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-phone"></i>
            <h3>Total Calls</h3>
          </div>
          <div className="card-content">
            <div className="stat-number">156</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-clock"></i>
            <h3>Average Duration</h3>
          </div>
          <div className="card-content">
            <div className="stat-number">4:32</div>
            <div className="stat-label">Minutes</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-chart-line"></i>
            <h3>Success Rate</h3>
          </div>
          <div className="card-content">
            <div className="stat-number">94%</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-users"></i>
            <h3>Active Users</h3>
          </div>
          <div className="card-content">
            <div className="stat-number">1,234</div>
            <div className="stat-label">Online Now</div>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <i className="fas fa-phone text-green"></i>
            <div className="activity-content">
              <div className="activity-title">Call completed successfully</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-user text-blue"></i>
            <div className="activity-content">
              <div className="activity-title">New user registered</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-cog text-orange"></i>
            <div className="activity-content">
              <div className="activity-title">System maintenance completed</div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;