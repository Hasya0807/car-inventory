import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      addToast('Successfully logged in!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to login', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-asphalt p-4">
      <div className="bg-charcoal p-8 rounded-lg max-w-sm w-full border border-gray-800 shadow-xl">
        <h1 className="text-3xl font-display font-bold text-chrome mb-6">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-graphite mb-1">Email</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
            {errors.email && <p className="text-ignition text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-graphite mb-1">Password</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
            {errors.password && <p className="text-ignition text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-ignition text-white px-4 py-2 mt-4 rounded font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ignition focus:ring-offset-2 focus:ring-offset-asphalt"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-graphite">
          Don't have an account? <Link to="/register" className="text-ignition hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};
