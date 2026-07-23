import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Settings } from 'lucide-react';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="w-full bg-surface min-h-[80vh] flex flex-col">
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm shrink-0">
             <Settings size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-text-main mb-1">Account Settings</h1>
            <p className="text-text-muted text-sm">Manage your personal information and preferences.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* Profile Details */}
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Personal Details</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-muted shrink-0 border border-border">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Full Name</p>
                <p className="text-lg font-bold text-text-main">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-muted shrink-0 border border-border">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Email Address</p>
                <p className="text-lg font-bold text-text-main">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-muted shrink-0 border border-border">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Account Role</p>
                <p className="text-lg font-bold text-text-main capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Account Actions</h2>
          <p className="text-text-muted text-sm mb-6">
            If you wish to log out of your account on this device, click the button below. You can always log back in later.
          </p>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut size={20} />
            Sign Out Securely
          </button>
        </div>

      </main>
    </div>
  );
};
