import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cow_auth_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cow_auth_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          setUser(res.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('cow_auth_token');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem('cow_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerApi(userData);
    localStorage.setItem('cow_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cow_auth_token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
