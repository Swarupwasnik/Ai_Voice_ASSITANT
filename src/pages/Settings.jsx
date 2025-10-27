import React, { useState } from 'react';
import '../styles/settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoAnswer: false,
    recordCalls: true,
    language: 'english',
    theme: 'light'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your dashboard preferences</p>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              Enable Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoAnswer}
                onChange={(e) => handleSettingChange('autoAnswer', e.target.checked)}
              />
              Auto Answer Calls
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.recordCalls}
                onChange={(e) => handleSettingChange('recordCalls', e.target.checked)}
              />
              Record Calls
            </label>
          </div>
        </div>
        
        <div className="settings-card">
          <h3>Preferences</h3>
          <div className="setting-item">
            <label>Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="btn-save">Save Changes</button>
        <button className="btn-reset">Reset to Default</button>
      </div>
    </div>
  );
};

export default Settings;