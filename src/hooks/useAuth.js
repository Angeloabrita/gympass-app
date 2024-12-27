import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * useAuth hook
 * 
 * This hook returns the values from the AuthContext provider.
 * The values returned are the user, isAuthenticated, login, logout, and loading states.
 * The login and logout functions are used to authenticate the user and set the user in local storage.
 * The loading state is used to show a loading page while the user is being authenticated.
 * The isAuthenticated state is used to check if the user is authenticated or not.
 * The user state is used to get the user data from the local storage.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;