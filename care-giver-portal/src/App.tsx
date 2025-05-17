import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder dashboard component
const CaregiverDashboard = () => <div style={{ padding: '20px' }}>Caregiver Dashboard</div>;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);

    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(loggedIn);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Routes>
      {/* Root route redirects based on auth */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/caregiver-dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Login />} />
        <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
      </Route>

      {/* Fallback route: redirect unknown paths to caregiver-dashboard */}
      <Route path="*" element={<Navigate to="/caregiver-dashboard" replace />} />
    </Routes>
  );
}
