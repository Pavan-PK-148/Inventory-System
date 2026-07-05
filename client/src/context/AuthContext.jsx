import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token session on application boot
    const checkUserSession = async () => {
      const token = localStorage.getItem('inventory_token');
      if (token) {
        try {
          // Verify with a mock response or an explicit token check if available
          const storedUser = localStorage.getItem('inventory_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          localStorage.removeItem('inventory_token');
          localStorage.removeItem('inventory_user');
        }
      }
      setLoading(false);
    };
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    localStorage.setItem('inventory_token', token);
    localStorage.setItem('inventory_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('inventory_token');
    localStorage.removeItem('inventory_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);