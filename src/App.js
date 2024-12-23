import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import GymDetailPage from './pages/GymDetailPage';
import useAuth from './hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if(loading) {
      return <p>Carregando...</p>
    }

    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/gyms/:id" element={<PrivateRoute><GymDetailPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;