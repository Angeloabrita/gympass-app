import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/jwt';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = verifyToken(token);
      if (decodedToken) {
        const localUser = localStorage.getItem('user'); //retrieve  all object user for persist data for all compoments, by all application
        const validLocalUser = localUser ? JSON.parse(localUser) : undefined; //if  valid then continue

        if (validLocalUser) { //valid the return type of parsed storage with real user if a type undefined dont set, or if localStorage not used . it also works for prevent bugs if user are clean storege user on console, and a real user exist when component render, it always show data or show default without undefined state causing crach in other parts

          setUser(validLocalUser);
        }

        setIsAuthenticated(true);

      } else { // if the local storage is invalid, dont render a broken view
        localStorage.removeItem('token') // invalidate any token by cleaning state on unvalid use cases in any routes, and remove localStorage to prevent inconsistencies to load views with old token after changes;

      }
    }
    setLoading(false);
  }, []);
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData)); //update data and state also  localStorage;
    setUser(userData);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);


  };

  const logout = () => {
    setUser(undefined); // when use logsout all token  and user should clean store as is no needed on use of  lib or app;
    localStorage.removeItem('token');
    localStorage.removeItem('user')// also clean when call action on other states. and set null to force the right behavior of the component as  default state ( when no has users);
    setIsAuthenticated(false);


  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};