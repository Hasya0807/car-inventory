import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CarFront, Calendar, Heart, Box, HelpCircle, Settings, LogOut, X, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../context/ToastContext'; 

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const baseItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', authRequired: true },
    { icon: CarFront, label: 'Inventory', path: '/' },
    { icon: Calendar, label: 'Compare', path: '/compare', authRequired: true },
    { icon: Heart, label: 'Wishlist', path: '/favorites', authRequired: true },
  ];

  const adminItems = [
    { icon: Box, label: 'Admin Panel', path: '/admin', authRequired: true },
    { icon: Calendar, label: 'Orders Placed', path: '/admin/orders', authRequired: true },
    { icon: HelpCircle, label: 'Test Drives', path: '/admin/test-drives', authRequired: true },
    { icon: Users, label: 'Customers', path: '/admin/customers', authRequired: true },
    { icon: CarFront, label: 'Inventory', path: '/' },
  ];

  const navItems = user?.role === 'admin' ? adminItems : baseItems;

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-50 transition-transform duration-300 w-64 md:w-24",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 text-text-muted hover:text-text-main"
      >
        <X size={24} />
      </button>

      {/* Logo Placeholder */}
      <div className="w-10 h-10 bg-primary text-gray-900 rounded-xl flex items-center justify-center font-bold text-xl mb-10 shrink-0 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full flex flex-col items-center md:items-center items-start px-6 md:px-0 gap-6">
        {navItems.map((item) => {
          if (item.authRequired && !user) return null;
          
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end
              className={({ isActive }) => 
                `flex items-center gap-4 w-full md:w-auto p-3 md:rounded-full rounded-xl transition-all duration-200 ${isActive && item.path !== '#' ? 'bg-primary text-gray-900 shadow-md' : 'text-text-muted hover:bg-surface hover:text-text-main'}`
              }
              title={item.label}
              onClick={onClose}
            >
              <item.icon size={22} strokeWidth={2.5} className="shrink-0" />
              <span className="md:hidden font-medium">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Push Settings to the bottom */}
        {user && (
          <div className="mt-auto flex flex-col gap-4 w-full md:w-auto">
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `flex items-center gap-4 w-full md:w-auto p-3 md:rounded-full rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-gray-900 shadow-md' : 'text-text-muted hover:bg-surface hover:text-text-main'}`
              }
              title="Settings"
              onClick={onClose}
            >
              <Settings size={22} strokeWidth={2.5} className="shrink-0" />
              <span className="md:hidden font-medium">Settings</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};
