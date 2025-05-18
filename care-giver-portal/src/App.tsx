// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import AddPersonPage from './pages/AddPersonPage';
import RemindersPage from './pages/RemindersPage';
import CaregiverDashboard from './pages/CaregiverDashboard';
import DashboardHome from './pages/DashboardHome';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import MMSE from './pages/mmsetest';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<CaregiverDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="persons" element={<AddPersonPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* MMSE Test as a separate protected page */}
        <Route path="mmsetest" element={<MMSE />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
