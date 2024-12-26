import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import GymDetailPage from './pages/GymDetailPage';
import useAuth from './hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './App.css';
import AppNavbar from './components/Navbar';
import CreateGymPage from './pages/CreateGymPage';// Add new route component for CreateGymPage;
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>
  }
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavbar />{/* Implement navbar component */}
        <div className='mt-navbar'>{/* Add styles on css file  ( App.css) and change to div because Router only allow child route elements and divs */}
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/gyms/:id" element={<PrivateRoute><GymDetailPage /></PrivateRoute>} />
            <Route path="/gyms/create" element={<PrivateRoute><CreateGymPage /> </PrivateRoute>} /> {/* Add route Create Gym page here and create path with protected path*/}
            <Route path="/" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;