import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../context/ToastContext';
import { Store, UserCircle2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 'user' or 'admin'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({ ...data, role });
      addToast(`Account created! Logged in as ${role === 'admin' ? 'Dealership Admin' : 'Customer'}.`, 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to register', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="bg-card p-8 rounded-2xl max-w-sm w-full border border-border shadow-xl">
        <div className="flex justify-center mb-6">
          <span className="font-display font-bold text-2xl tracking-tighter text-text-main">
            AUTO<span className="text-primary">STORE</span>
          </span>
        </div>

        <h1 className="text-2xl font-display font-bold text-text-main text-center mb-6">Create Account</h1>

        {/* Role Selector */}
        <div className="flex p-1 bg-surface rounded-xl mb-6 border border-border">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all",
              role === 'user' 
                ? "bg-card text-text-main shadow-sm border border-border" 
                : "text-text-muted hover:text-text-main"
            )}
          >
            <UserCircle2 size={16} /> Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all",
              role === 'admin' 
                ? "bg-primary text-gray-900 shadow-sm" 
                : "text-text-muted hover:text-text-main"
            )}
          >
            <Store size={16} /> Dealership
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
            <input 
              {...register('name')}
              type="text"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-gray-900 px-4 py-3 mt-4 rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm"
          >
            {isSubmitting ? 'Creating account...' : `Register as ${role === 'admin' ? 'Admin' : 'Customer'}`}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
