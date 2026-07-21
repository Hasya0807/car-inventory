import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CarFront, Calendar, Heart, Box, HelpCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../context/ToastContext'; // assuming we have a cn utility here or we can just use template literals

export const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', authRequired: true },
    { icon: CarFront, label: 'Inventory', path: '/' },
    { icon: Calendar, label: 'Compare', path: '/compare', authRequired: true },
    { icon: Heart, label: 'Wishlist', path: '/dashboard', authRequired: true }, // Using dashboard for wishlist for now
    { icon: Box, label: 'Orders', path: '#', authRequired: true },
    { icon: HelpCircle, label: 'Support', path: '#' },
    { icon: Settings, label: 'Settings', path: '#' },
  ];

  return (
    <aside className="w-20 md:w-24 bg-card border-r border-border h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      {/* Logo Placeholder */}
      <div className="w-10 h-10 bg-text-main text-white rounded-xl flex items-center justify-center font-bold text-xl mb-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full flex flex-col items-center gap-6">
        {navItems.map((item, index) => {
          if (item.authRequired && !user) return null;
          
          if (item.label === 'Help' || item.label === 'Support') {
             // Divider before bottom items
             return (
               <React.Fragment key={item.label}>
                 <div className="w-8 h-px bg-border my-2"></div>
                 <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `p-3 rounded-full transition-all duration-200 ${isActive && item.path !== '#' ? 'bg-primary text-gray-900' : 'text-text-muted hover:bg-surface hover:text-text-main'}`
                    }
                    title={item.label}
                  >
                    <item.icon size={22} strokeWidth={2} />
                  </NavLink>
               </React.Fragment>
             )
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => 
                `p-3 rounded-full transition-all duration-200 ${isActive && item.path !== '#' ? 'bg-primary text-text-main shadow-md' : 'text-text-muted hover:bg-surface hover:text-text-main'}`
              }
              title={item.label}
            >
              <item.icon size={22} strokeWidth={2.5} />
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      {user && (
        <button 
          onClick={logout}
          className="p-3 text-text-muted hover:bg-red-50 hover:text-red-500 rounded-full transition-colors mt-auto"
          title="Logout"
        >
          <LogOut size={22} strokeWidth={2.5} />
        </button>
      )}
    </aside>
  );
};
