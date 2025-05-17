import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, ArrowRight, Calendar, Info } from 'lucide-react';

export default function DashboardHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Mock data for dashboard
  const upcomingReminders = [
    {
      id: 1,
      title: 'Take Medication',
      time: '9:00 AM',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Doctor Appointment',
      time: '2:30 PM',
      date: 'May 25, 2025'
    }
  ];
  
  const recentPeople = [
    {
      id: 1,
      name: 'John Smith',
      relationship: 'Family Member',
      image: null
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      relationship: 'Doctor',
      image: null
    }
  ];
  
  return (
    <>
      <style>{`
        .dashboard-home {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .welcome-section {
          background: linear-gradient(to right, #3b82f6, #1e40af);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .welcome-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .welcome-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: white;
        }

        .welcome-date {
          color: #e0f2fe;
          margin-top: 0.5rem;
          font-size: 1rem;
        }

        .reminder-badge {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
        }

        .reminder-badge-text {
          color: white;
          margin-left: 0.5rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .dashboard-card {
          background-color: #1f2937;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }

        .view-all-link {
          color: #60a5fa;
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .view-all-link:hover {
          color: #93c5fd;
        }

        .view-all-icon {
          margin-left: 0.25rem;
        }

        .quick-access-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .quick-access-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #374151;
          padding: 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .quick-access-item:hover {
          background-color: #4b5563;
        }

        .quick-access-icon {
          color: #60a5fa;
          margin-bottom: 0.5rem;
        }

        .quick-access-text {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .reminder-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .reminder-item {
          background-color: #374151;
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .reminder-icon-container {
          background-color: #3b82f6;
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-right: 0.75rem;
        }

        .reminder-icon {
          color: white;
        }

        .reminder-details {
          flex: 1;
        }

        .reminder-title {
          color: white;
          font-weight: 500;
        }

        .reminder-datetime {
          display: flex;
          align-items: center;
          color: #d1d5db;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .reminder-calendar-icon {
          margin-right: 0.25rem;
        }

        .people-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .person-card {
          background-color: #374151;
          padding: 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
        }

        .person-avatar {
          background-color: #4b5563;
          height: 3rem;
          width: 3rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .person-avatar-icon {
          color: #9ca3af;
        }

        .person-details {
          flex: 1;
        }

        .person-name {
          color: white;
          font-weight: 500;
        }

        .person-relationship {
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .add-person-link {
          background-color: #374151;
          padding: 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #4b5563;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .add-person-link:hover {
          background-color: #4b5563;
        }

        .add-person-content {
          text-align: center;
        }

        .add-person-icon-container {
          background-color: #3b82f6;
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem auto;
        }

        .add-person-icon {
          color: white;
        }

        .add-person-text {
          color: #60a5fa;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .welcome-content {
            flex-direction: row;
            align-items: center;
          }

          .reminder-badge {
            margin-top: 0;
          }

          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }

          .people-card {
            grid-column: span 2;
          }

          .people-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="dashboard-home">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div>
              <h1 className="welcome-title">Welcome back</h1>
              <p className="welcome-date">{formattedDate} | {formattedTime}</p>
            </div>
            <div className="reminder-badge">
              <Info size={20} className="text-blue-200" />
              <span className="reminder-badge-text">2 upcoming reminders today</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Quick Access Card */}
          <div className="dashboard-card">
            <h2 className="card-title">Quick Access</h2>
            <div className="quick-access-grid">
              <Link to="/dashboard/persons" className="quick-access-item">
                <Users size={32} className="quick-access-icon" />
                <span className="quick-access-text">Manage People</span>
              </Link>
              <Link to="/dashboard/reminders" className="quick-access-item">
                <Bell size={32} className="quick-access-icon" />
                <span className="quick-access-text">Reminders</span>
              </Link>
            </div>
          </div>
          
          {/* Upcoming Reminders Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Upcoming Reminders</h2>
              <Link to="/dashboard/reminders" className="view-all-link">
                View All
                <ArrowRight size={16} className="view-all-icon" />
              </Link>
            </div>
            
            <div className="reminder-list">
              {upcomingReminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <div className="flex items-center">
                    <div className="reminder-icon-container">
                      <Bell size={18} className="reminder-icon" />
                    </div>
                    <div className="reminder-details">
                      <h3 className="reminder-title">{reminder.title}</h3>
                      <div className="reminder-datetime">
                        <Calendar size={14} className="reminder-calendar-icon" />
                        <span>{reminder.date}, {reminder.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* People Card */}
          <div className="dashboard-card people-card">
            <div className="card-header">
              <h2 className="card-title">Recent People</h2>
              <Link to="/dashboard/persons" className="view-all-link">
                View All
                <ArrowRight size={16} className="view-all-icon" />
              </Link>
            </div>
            
            <div className="people-grid">
              {recentPeople.map(person => (
                <div key={person.id} className="person-card">
                  <div className="person-avatar">
                    {person.image ? (
                      <img 
                        src={person.image} 
                        alt={person.name} 
                        className="h-12 w-12 rounded-full object-cover" 
                      />
                    ) : (
                      <Users size={24} className="person-avatar-icon" />
                    )}
                  </div>
                  <div className="person-details">
                    <h3 className="person-name">{person.name}</h3>
                    <p className="person-relationship">{person.relationship}</p>
                  </div>
                </div>
              ))}
              
              <Link to="/dashboard/persons" className="add-person-link">
                <div className="add-person-content">
                  <div className="add-person-icon-container">
                    <Users size={20} className="add-person-icon" />
                  </div>
                  <span className="add-person-text">Add New Person</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}