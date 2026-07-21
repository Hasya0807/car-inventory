import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional()
});

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registerAuth(data);
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to register', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-asphalt p-4 py-12">
      <div className="bg-charcoal p-8 rounded-lg max-w-md w-full border border-gray-800 shadow-xl">
        <h1 className="text-3xl font-display font-bold text-chrome mb-6">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-graphite mb-1">Name *</label>
            <input 
              {...register('name')}
              type="text"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
            {errors.name && <p className="text-ignition text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-graphite mb-1">Email *</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
            {errors.email && <p className="text-ignition text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-graphite mb-1">Password *</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
            {errors.password && <p className="text-ignition text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-graphite mb-1">Phone</label>
            <input 
              {...register('phone')}
              type="text"
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-graphite mb-1">Address</label>
            <textarea 
              {...register('address')}
              className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-ignition text-white px-4 py-2 mt-4 rounded font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ignition focus:ring-offset-2 focus:ring-offset-asphalt"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-graphite">
          Already have an account? <Link to="/login" className="text-ignition hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
