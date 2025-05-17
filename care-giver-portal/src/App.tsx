// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder dashboard component
const CaregiverDashboard = () => <div style={{padding: '20px'}}>Caregiver Dashboard</div>;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in on mount
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(loggedIn);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? 
          <Navigate to="/caregiver-dashboard" /> 
          : 
          <Login />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Login />} />
        <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
      </Route>
    </Routes>
  );
}