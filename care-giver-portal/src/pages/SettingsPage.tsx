import { useState } from 'react';
import { Save, Bell, Moon, Sun, User } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reminderSound, setReminderSound] = useState(true);
  const [nameInput, setNameInput] = useState('Jane Doe');
  const [emailInput, setEmailInput] = useState('jane.doe@example.com');
  
  const handleSaveProfile = () => {
    // Here you would save the profile information
    alert('Profile information saved!');
  };
  
  return (
    <>
      <style>{`
        .settings-container {
          max-width: 48rem;
          margin: 0 auto;
        }

        .settings-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2rem;
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-card {
          background-color: #1f2937;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .settings-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .settings-card-icon {
          color: #60a5fa;
          margin-right: 0.5rem;
        }

        .settings-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
          margin-bottom: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background-color: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.375rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        .save-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          width: fit-content;
        }

        .save-button:hover {
          background-color: #2563eb;
        }

        .save-button:active {
          transform: scale(0.98);
        }

        .button-icon {
          margin-right: 0.5rem;
        }
        
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .toggle-label {
          display: flex;
          align-items: center;
          color: white;
        }
        
        .toggle-icon {
          color: #d1d5db;
          margin-right: 0.5rem;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 2.75rem;
          height: 1.5rem;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #374151;
          transition: .4s;
          border-radius: 9999px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 1.25rem;
          width: 1.25rem;
          left: 0.125rem;
          bottom: 0.125rem;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
          background-color: #3b82f6;
        }
        
        input:focus + .toggle-slider {
          box-shadow: 0 0 1px #3b82f6;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(1.25rem);
        }
        
        .toggle-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>
        
        <div className="settings-section">
          {/* Profile Settings */}
          <div className="settings-card">
            <div className="settings-card-header">
              <User className="settings-card-icon" size={24} />
              <h2 className="settings-card-title">Profile Information</h2>
            </div>
            
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <button
                onClick={handleSaveProfile}
                className="save-button"
              >
                <Save size={16} className="button-icon" />
                Save Changes
              </button>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Moon className="settings-card-icon" size={24} />
              <h2 className="settings-card-title">Appearance</h2>
            </div>
            
            <div className="toggle-row">
              <div className="toggle-label">
                {darkMode ? (
                  <Moon size={18} className="toggle-icon" />
                ) : (
                  <Sun size={18} className="toggle-icon" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Bell className="settings-card-icon" size={24} />
              <h2 className="settings-card-title">Notifications</h2>
            </div>
            
            <div className="toggle-row">
              <span>Enable Notifications</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-row">
              <span>Reminder Sounds</span>
              <label className={`toggle-switch ${!notifications ? 'toggle-disabled' : ''}`}>
                <input 
                  type="checkbox"
                  checked={reminderSound}
                  onChange={() => setReminderSound(!reminderSound)}
                  disabled={!notifications}
                />
                <span className={`toggle-slider ${!notifications ? 'toggle-disabled' : ''}`}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}