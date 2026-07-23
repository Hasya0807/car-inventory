import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-charcoal border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-chrome tracking-tight">AUTO<span className="text-ignition">STORE</span></span>
            </Link>
            {user && (
              <div className="ml-10 flex items-center space-x-6">
                <Link to="/dashboard" className="text-sm font-medium text-graphite hover:text-chrome transition-colors">
                  Dashboard
                </Link>
                <Link to="/compare" className="text-sm font-medium text-graphite hover:text-chrome transition-colors">
                  Compare
                </Link>
                
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-sm font-medium text-graphite hover:text-chrome transition-colors">
                      Manage Inventory
                    </Link>
                    <Link to="/admin/analytics" className="text-sm font-medium text-graphite hover:text-chrome transition-colors">
                      Analytics
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-graphite">
                  <User size={16} />
                  <span>{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-graphite hover:text-chrome transition-colors focus:outline-none focus:text-chrome"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-graphite hover:text-chrome transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-primary text-gray-900 text-sm font-medium px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
