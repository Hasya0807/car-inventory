import React from 'react';
import { Sun, Moon, Mail, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const TopHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-surface flex items-center justify-between px-8 w-full">
      {/* Brand */}
      <div className="flex items-center">
        <Link to="/" className="text-3xl font-display font-medium tracking-tight text-text-main">
          DriveMatch
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle (UI Mock) */}
        <div className="flex items-center bg-card rounded-full shadow-sm p-1 border border-border">
          <button className="p-2 bg-primary rounded-full text-text-main transition-colors">
            <Sun size={18} />
          </button>
          <button className="p-2 text-text-muted hover:text-text-main transition-colors">
            <Moon size={18} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text-main shadow-sm transition-colors">
            <Mail size={18} />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text-main shadow-sm transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full border border-border overflow-hidden">
          {user ? (
            <span className="font-bold text-sm text-text-main">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <Link to="/login" className="text-text-muted hover:text-primary-dark transition-colors">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
