import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/jwt';
export const AuthContext = createContext();
/**
 * The AuthProvider component is the context provider for the entire app.
 * It holds the current user, whether the user is authenticated or not, and
 * a loading state. It also provides the login and logout functions to the
 * context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // The current user, will be undefined if the user is not authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Whether the user is authenticated or not.
  const [loading, setLoading] = useState(true); // A loading state, will be true until the user is authenticated or the token is invalid.

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = verifyToken(token);

      if (decodedToken) {
        const localUser = localStorage.getItem('user');  // get the user from local storage, if it exists.
        const validLocalUser = localUser ? JSON.parse(localUser) : undefined // if the user exists, parse it to a valid object.
        if (validLocalUser) { // if the user exists and is valid, set it as the current user.

          setUser(validLocalUser);
        }
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  /**
   * The login function sets the current user, sets the token in local storage, and
   * sets the isAuthenticated state to true.
   * @param {object} userData The user data to be set, should contain name, email, id, and role.
   * @param {string} token The token to be set in local storage.
   */
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData))// set the user in local storage as a string.
    setUser(userData); // set the current user.
    localStorage.setItem('token', token); // set the token in local storage.

    setIsAuthenticated(true);

  };

  /**
   * The logout function sets the current user to undefined, removes the token
   * and user from local storage, and sets the isAuthenticated state to false.
   */
  const logout = () => {
    setUser(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // clear all keys as local strategy by removing every local item.
    setIsAuthenticated(false);

  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
