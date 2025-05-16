// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import authLogout from '../../utils/authLogout';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoggedIn = !!token;

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    const result = await authLogout();
    if (result) {
      setToken(null);
    }
    //localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
