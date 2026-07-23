import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
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

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    
    let isMounted = true;
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (isMounted && res.data?.success) {
          setWishlistedIds(new Set(res.data.data.map(v => v._id)));
        }
      } catch (e) {
        console.error("Failed to fetch wishlist", e);
      }
    };
    fetchWishlist();
    
    return () => { isMounted = false; };
  }, [user]);

  const login = useCallback(async (email, password, role) => {
    const data = await authService.login(email, password, role);
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setWishlistedIds(new Set());
  }, []);

  const toggleWishlistId = useCallback((id) => {
    setWishlistedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    wishlistedIds,
    toggleWishlistId
  }), [user, token, login, register, logout, wishlistedIds, toggleWishlistId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
