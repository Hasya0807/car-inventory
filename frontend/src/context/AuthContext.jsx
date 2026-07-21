import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  // Fetch wishlist when user logs in or is already logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.role !== 'admin') {
        try {
          const res = await api.get('/wishlist');
          if (res.data && res.data.success) {
            const ids = new Set(res.data.data.map(vehicle => vehicle._id));
            setWishlistedIds(ids);
          }
        } catch (e) {
          console.error("Failed to fetch wishlist", e);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const login = async (email, password, role) => {
    const data = await authService.login(email, password, role);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setWishlistedIds(new Set());
    window.location.href = '/login';
  };

  const toggleWishlistId = (id) => {
    setWishlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isAdmin: user?.role === 'admin',
      wishlistedIds,
      toggleWishlistId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
