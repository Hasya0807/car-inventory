import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1886).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van']),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.coerce.number().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  // image is handled separately as a File object
});

export const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      category: 'Sedan',
      quantity: 1,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      mileage: 0,
      color: '',
      description: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (data) => {
    // We must use FormData because we are sending a file
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">Make</label>
          <input 
            {...register('make')}
            type="text"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Model</label>
          <input 
            {...register('model')}
            type="text"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">Year</label>
          <input 
            {...register('year')}
            type="number"
            min="1886"
            max={new Date().getFullYear() + 1}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Category</label>
          <select 
            {...register('category')}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          >
            <option className="bg-card text-text-main" value="Sedan">Sedan</option>
            <option className="bg-card text-text-main" value="SUV">SUV</option>
            <option className="bg-card text-text-main" value="Truck">Truck</option>
            <option className="bg-card text-text-main" value="Coupe">Coupe</option>
            <option className="bg-card text-text-main" value="Hatchback">Hatchback</option>
            <option className="bg-card text-text-main" value="Van">Van</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">Price (₹)</label>
          <input 
            {...register('price')}
            type="number"
            step="0.01"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Stock Quantity</label>
          <input 
            {...register('quantity')}
            type="number"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">Fuel Type</label>
          <select 
            {...register('fuel')}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          >
            <option className="bg-card text-text-main" value="Gasoline">Gasoline</option>
            <option className="bg-card text-text-main" value="Diesel">Diesel</option>
            <option className="bg-card text-text-main" value="Electric">Electric</option>
            <option className="bg-card text-text-main" value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Transmission</label>
          <select 
            {...register('transmission')}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          >
            <option className="bg-card text-text-main" value="Automatic">Automatic</option>
            <option className="bg-card text-text-main" value="Manual">Manual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">Mileage</label>
          <input 
            {...register('mileage')}
            type="number"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Color</label>
          <input 
            {...register('color')}
            type="text"
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-1">Description</label>
        <textarea 
          {...register('description')}
          rows="3"
          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-1">Upload Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl bg-surface hover:border-primary transition-colors cursor-pointer group">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-text-muted group-hover:text-primary transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-text-muted justify-center">
              <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <span>Upload a file</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-text-muted">
              {imageFile ? imageFile.name : "PNG, JPG, WEBP up to 10MB"}
            </p>
          </div>
        </div>
        {initialData?.imageUrl && !imageFile && (
          <p className="text-xs text-text-muted mt-2">Current image: <a href={initialData.imageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">View</a></p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm text-text-main bg-surface border border-border hover:bg-card rounded-xl font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm text-gray-900 bg-primary hover:bg-primary-dark rounded-xl font-bold disabled:opacity-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};
