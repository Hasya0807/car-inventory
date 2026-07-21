import React from 'react';
import { Sun, Moon, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export const TopHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-20 bg-surface flex items-center justify-between px-4 md:px-8 w-full border-b border-border md:border-none shrink-0 sticky top-0 z-30">
      
      {/* Brand & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-text-muted hover:text-text-main md:hidden transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-main">
          AUTO<span className="text-primary">STORE</span>
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Theme Toggle */}
        <div className="flex items-center bg-card rounded-full shadow-sm p-1 border border-border relative">
          <button 
            onClick={() => isDark && toggleTheme()}
            className={`p-2 rounded-full transition-colors relative z-10 ${!isDark ? 'text-gray-900' : 'text-text-muted hover:text-text-main'}`}
          >
            <Sun size={18} />
          </button>
          <button 
            onClick={() => !isDark && toggleTheme()}
            className={`p-2 rounded-full transition-colors relative z-10 ${isDark ? 'text-gray-900' : 'text-text-muted hover:text-text-main'}`}
          >
            <Moon size={18} />
          </button>
          {/* Animated Background Pill */}
          <div 
            className={`absolute top-1 bottom-1 w-[34px] bg-primary rounded-full transition-transform duration-300 ease-in-out ${isDark ? 'translate-x-[34px]' : 'translate-x-0'}`}
          ></div>
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
