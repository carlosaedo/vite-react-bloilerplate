import { createContext, useContext, useState, useEffect } from 'react';
import authLogout from '../../utils/authLogout';
import authCheckLoginStatus from '../../utils/authCheckLoginStatus';
import { jwtDecode } from 'jwt-decode';
import cleanLocalStorage from '../../utils/cleanLocalStorage';
import torrestirApi from '../api/torrestirApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userEmail] = useState(() => localStorage.getItem('userEmail'));
  const [avatar, setAvatar] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  async function fetchAvatar(id) {
    let objectUrl;
    try {
      const response = await torrestirApi.get(`/api/cdn/avatar/${id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      if (response.status === 200) {
        objectUrl = URL.createObjectURL(response.data);
        setAvatar(objectUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    cleanLocalStorage();
  };

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      setUserRole(decoded.typ || 'user');
      setUserId(decoded.sub);
      fetchAvatar(decoded.sub);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token decoding failed during login', error);
      clearAuthData();
    }
  };

  const logout = async () => {
    const result = await authLogout();
    if (result) {
      clearAuthData();
    }
  };

  const checkLoginStatusAuth = async () => {
    try {
      const loginStatus = await authCheckLoginStatus();
      if (loginStatus) {
        return true;
      } else {
        clearAuthData();
        setLoadingAuth(false);
        return false;
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      clearAuthData();
      setLoadingAuth(false);
    }
  };

  const getToken = () => {
    return token;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginStatus = await authCheckLoginStatus();
        if (loginStatus) {
          initAuth();
        } else {
          clearAuthData();
          setLoadingAuth(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        clearAuthData();
        setLoadingAuth(false);
      }
    };

    const initAuth = () => {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setUserRole(decoded.typ || 'user');
        setUserId(decoded.sub);
        fetchAvatar(decoded.sub);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Invalid token', error);
        clearAuthData();
      } finally {
        setLoadingAuth(false);
      }
    };
    checkLoginStatus();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        checkLoginStatusAuth,
        login,
        logout,
        user,
        userRole,
        loadingAuth,
        getToken,
        userId,
        userEmail,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
