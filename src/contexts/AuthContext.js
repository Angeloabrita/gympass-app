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
        const localUser = localStorage.getItem('user');  //recover props correctly from local storage, with local copy;
        const validLocalUser = localUser ? JSON.parse(localUser) : undefined // json format only for prevent payload format invalid if the case and check  undefined;
        if (validLocalUser) { // if exitst  ( not undefined or another invalid  type like number, etc ). set that obj  on setUser

          setUser(validLocalUser);
        }
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => { // data will be a object of name, email, id and role.
    localStorage.setItem('user', JSON.stringify(userData))//send real obj with the props
    setUser(userData); // set props with a full user object (including the "name"). using localstorage info, avoiding  id,role only
    localStorage.setItem('token', token); // send token from header as before .

    setIsAuthenticated(true);


  };

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); //clear all keys  as local strategy by removing every local item.
    setIsAuthenticated(false);

  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};