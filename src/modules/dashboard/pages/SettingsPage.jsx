import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      {/* Settings Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and application settings</p>
      </div>

      {/* Empty content area - ready for future development */}
      <div className="settings-content">
        <div className="settings-placeholder">
          <div className="placeholder-icon">
            <Settings size={48} strokeWidth={1.5} />
          </div>
          <h3>Settings Coming Soon</h3>
          <p>This section is under development. Settings features will be available in future updates.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
