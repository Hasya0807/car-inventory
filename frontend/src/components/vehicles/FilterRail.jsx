import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FilterRail = ({ filters, onFilterChange, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Pickup', 'Van'];
  const colors = [
    { label: 'Black', code: '#000000' },
    { label: 'Blue', code: '#3B82F6' },
    { label: 'Brown', code: '#8B4513' },
    { label: 'Red', code: '#EF4444' },
    { label: 'Silver', code: '#9CA3AF' },
    { label: 'All Colors', code: 'conic-gradient(from 0deg, red, yellow, green, blue, purple, red)' } // rainbow for all
  ];

  return (
    <div className="w-full md:w-[320px] shrink-0 bg-card p-6 rounded-3xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-text-main">Filters</h2>
        {Object.keys(filters).length > 0 && (
          <button 
            onClick={onClear}
            className="text-primary-dark font-medium text-sm hover:underline"
          >
            Reset all
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        
        {/* Brand & Model */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <select 
              name="make"
              value={filters.make || ''}
              onChange={handleChange}
              className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Select Brand</option>
              <option value="Toyota">Toyota</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Tesla">Tesla</option>
              <option value="BMW">BMW</option>
              <option value="Hyundai">Hyundai</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-3.5 text-text-muted pointer-events-none" />
          </div>
          
          {/* Mock Model Dropdown */}
          <div className="relative flex-1">
            <select 
              className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              disabled
            >
              <option value="">Choose Model</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-3.5 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <h3 className="text-base font-medium text-text-main mb-4">Budget Range</h3>
          {/* Fake range slider track to match UI */}
          <div className="relative h-1 bg-surface rounded-full mb-6 mt-2">
            <div className="absolute left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow"></div>
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow"></div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="number" 
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-3.5 text-text-muted font-medium">$</span>
            </div>
            <div className="flex-1 relative">
              <input 
                type="number" 
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleChange}
                placeholder="Max"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-3.5 text-text-muted font-medium">$</span>
            </div>
          </div>
        </div>

        {/* Type / Category */}
        <div>
          <h3 className="text-base font-medium text-text-main mb-4">Type</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isActive = (filters.category || '').toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => onFilterChange('category', isActive ? '' : cat.toLowerCase())}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive 
                      ? 'bg-primary border-primary text-text-main shadow-sm' 
                      : 'bg-card border-border text-text-main hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="text-base font-medium text-text-main mb-4">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const isActive = filters.color === color.label;
              return (
                <button
                  key={color.label}
                  onClick={() => onFilterChange('color', isActive ? '' : color.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive 
                      ? 'bg-card border-gray-400 text-text-main shadow-sm' 
                      : 'bg-card border-border text-text-main hover:border-gray-300'
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ background: color.code }}
                  />
                  {color.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Filters just as toggles to not clutter too much */}
        <div>
           <label className="flex items-center space-x-3 text-sm text-text-main font-medium cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={filters.inStock === 'true' || filters.inStock === true}
                onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
                className="w-5 h-5 bg-surface border-border rounded text-primary focus:ring-primary focus:ring-offset-card"
              />
              <span>In Stock Only</span>
            </label>
        </div>

      </div>
    </div>
  );
};
