import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Bell, Settings, Menu, X, LogOut } from 'lucide-react';

export default function CaregiverDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #f9fafb;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .sidebar {
          background-color: #1f2937;
          width: 260px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #374151;
        }

        .sidebar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .nav-container {
          flex: 1;
          padding: 1.5rem 1rem;
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #d1d5db;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .nav-link:hover {
          background-color: #374151;
          color: #f9fafb;
          transform: translateX(2px);
        }

        .nav-link.active {
          background-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        .nav-link-icon {
          margin-right: 0.75rem;
        }

        .logout-container {
          padding: 1rem;
          border-top: 1px solid #374151;
        }

        .logout-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: #d1d5db;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .logout-icon {
          margin-right: 0.75rem;
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #1f2937;
          padding: 1rem;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .mobile-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .menu-button {
          background: none;
          border: none;
          color: #d1d5db;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .menu-button:hover {
          background-color: #374151;
          color: #f9fafb;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background-color: #1f2937;
          padding: 1rem;
          z-index: 99;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .mobile-header {
            display: block;
          }

          .mobile-menu.open {
            display: block;
          }

          .main-content {
            padding-top: 5rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar for desktop */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Caregiver Portal</h1>
          </div>
          <nav className="nav-container">
            <NavLink 
              to="/dashboard" 
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Home className="nav-link-icon" size={20} />
              Dashboard
            </NavLink>
            <NavLink 
              to="/dashboard/persons" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Users className="nav-link-icon" size={20} />
              Manage People
            </NavLink>
            <NavLink 
              to="/dashboard/reminders" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Bell className="nav-link-icon" size={20} />
              Reminders
            </NavLink>
            <NavLink 
              to="/dashboard/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Settings className="nav-link-icon" size={20} />
              Settings
            </NavLink>
          </nav>
          <div className="logout-container">
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="logout-icon" size={20} />
              Log Out
            </button>
          </div>
        </div>

        {/* Mobile header */}
        <div className="mobile-header">
          <div className="mobile-header-content">
            <h1 className="mobile-title">Caregiver Portal</h1>
            <button
              onClick={toggleMobileMenu}
              className="menu-button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="nav-link-icon" size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/dashboard/persons" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users className="nav-link-icon" size={20} />
            Manage People
          </NavLink>
          <NavLink 
            to="/dashboard/reminders" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Bell className="nav-link-icon" size={20} />
            Reminders
          </NavLink>
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="nav-link-icon" size={20} />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut className="logout-icon" size={20} />
            Log Out
          </button>
        </div>

        {/* Main content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}