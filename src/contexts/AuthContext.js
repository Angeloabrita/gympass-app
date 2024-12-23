import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/jwt';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
     const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

 useEffect(() => {
       const token = localStorage.getItem('token');
    if (token) {
            const decodedToken = verifyToken(token);
          if (decodedToken) {
           setUser(decodedToken);
        setIsAuthenticated(true);
         }
         }
     setLoading(false);
}, []);

      const login = (userData, token) => {
     setUser(userData);
        localStorage.setItem('token', token);
         setIsAuthenticated(true);
       };
    const logout = () => {
        setUser(null);
       localStorage.removeItem('token');
     setIsAuthenticated(false);
 };

   return (
     <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
      </AuthContext.Provider>
   );
  };