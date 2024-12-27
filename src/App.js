import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import GymDetailPage from './pages/GymDetailPage';
import useAuth from './hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/Navbar' // Import nav component
import CreateGymPage from './pages/CreateGymPage';
import HomePage from './pages/HomePage'

/**
 * PrivateRoute
 * 
 * This component is a wrapper around the Route component from react-router-dom.
 * It checks if the user is authenticated and if the authentication is still loading.
 * If the user is authenticated, it renders the children component. Otherwise, it redirects the user to the /auth page.
 * 
 * @param {React.ReactNode} children the component to render if the user is authenticated
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <p>Carregando...</p>
  }
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

/**
 * App
 * 
 * The main component of the application. It renders the AppNavbar and a div with the class 'mt-navbar' that contains the Routes
 * component. The Routes component renders the correct page based on the current path.
 * The PrivateRoute component is used to protect the routes that require authentication. If the user is not authenticated, it redirects
 * the user to the /auth page.
 * The AppProvider component is used to provide the authentication context to all the components in the application.
 */
const App = () => {
  return (
    <AuthProvider>
        <AppNavbar />
        <div className='mt-navbar'>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/gyms/:id" element={<PrivateRoute><GymDetailPage /></PrivateRoute>} />
            <Route path="/gyms/create" element={<PrivateRoute><CreateGymPage /> </PrivateRoute>} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;