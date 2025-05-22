// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authLogout from '../../utils/authLogout';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null); // null instead of 'guest'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new loading state

  const isLoggedIn = !!token;

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          setUser(decoded);
          setUserRole(decoded.typ || 'user');
        } catch (error) {
          console.error('Invalid token', error);
          setUser(null);
          setUserRole(null);
          logout();
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false); // done loading
    };

    initAuth();
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
    setUserRole(decoded.typ || 'user');
  };

  const logout = async () => {
    const result = await authLogout();
    if (result) {
      setToken(null);
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout, user, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
