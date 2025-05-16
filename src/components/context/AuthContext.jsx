// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import authLogout from '../../utils/authLogout';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState('visitor');
  const isLoggedIn = !!token;

  const user = {
    role: userRole,
  };

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const role = (userRole) => {
    setUserRole(userRole);
  };

  const logout = async () => {
    const result = await authLogout();
    if (result) {
      setToken(null);
    }
    //localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout, user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
