// App.tsx
import { Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      
      {/* Protected Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Login />} />
      </Route>
    </Routes>
  );
}
