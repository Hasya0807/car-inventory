import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1886).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be greater than 0'),
  category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van']),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      category: 'Sedan',
      quantity: 1,
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-graphite mb-1">Make</label>
          <input 
            {...register('make')}
            type="text"
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          />
          {errors.make && <p className="text-ignition text-xs mt-1">{errors.make.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-graphite mb-1">Model</label>
          <input 
            {...register('model')}
            type="text"
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          />
          {errors.model && <p className="text-ignition text-xs mt-1">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-graphite mb-1">Year</label>
          <input 
            {...register('year', { valueAsNumber: true })}
            type="number"
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          />
          {errors.year && <p className="text-ignition text-xs mt-1">{errors.year.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-graphite mb-1">Category</label>
          <select 
            {...register('category')}
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          >
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Van">Van</option>
          </select>
          {errors.category && <p className="text-ignition text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-graphite mb-1">Price ($)</label>
          <input 
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome font-mono focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          />
          {errors.price && <p className="text-ignition text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-graphite mb-1">Stock Quantity</label>
          <input 
            {...register('quantity', { valueAsNumber: true })}
            type="number"
            className="w-full bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome font-mono focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
          />
          {errors.quantity && <p className="text-ignition text-xs mt-1">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-chrome bg-gray-800 hover:bg-gray-700 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-white bg-ignition hover:bg-orange-600 rounded font-medium disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ignition focus:ring-offset-2 focus:ring-offset-charcoal"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};
