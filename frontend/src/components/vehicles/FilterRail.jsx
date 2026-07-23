import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FilterRail = ({ filters, onFilterChange, onClear, meta }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van'];
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
        
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search inventory..."
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select 
            name="sort"
            value={filters.sort || 'price_asc'}
            onChange={handleChange}
            className="w-full appearance-none bg-surface border border-border rounded-xl pl-4 pr-10 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="price_asc">Price Low → High</option>
            <option value="price_desc">Price High → Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-3.5 text-text-muted pointer-events-none" />
        </div>
        
        {/* Brand & Model */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <select 
              name="make"
              value={filters.make || ''}
              onChange={handleChange}
              className="w-full appearance-none bg-surface border border-border rounded-xl pl-4 pr-10 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-ellipsis"
            >
              <option value="">Brand</option>
              {meta?.makes?.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-3.5 text-text-muted pointer-events-none" />
          </div>
          
          <div className="relative flex-1">
            <select 
              name="model"
              value={filters.model || ''}
              onChange={handleChange}
              className="w-full appearance-none bg-surface border border-border rounded-xl pl-4 pr-10 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 text-ellipsis"
              disabled={!meta?.models || meta?.models.length === 0}
            >
              <option value="">Model</option>
              {meta?.models?.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-3.5 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-text-main">Budget Range</h3>
          </div>
          
          {(() => {
            const minLimit = meta?.minPrice || 0;
            const maxLimit = meta?.maxPrice || 10000000;
            const currentMin = filters.minPrice !== undefined && filters.minPrice !== '' ? Number(filters.minPrice) : minLimit;
            const currentMax = filters.maxPrice !== undefined && filters.maxPrice !== '' ? Number(filters.maxPrice) : maxLimit;
            
            const leftPercent = Math.max(0, Math.min(100, ((currentMin - minLimit) / (maxLimit - minLimit || 1)) * 100));
            const rightPercent = Math.max(0, Math.min(100, ((currentMax - minLimit) / (maxLimit - minLimit || 1)) * 100));

            const sliderClassName = "absolute top-0 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer";

            return (
              <div className="relative w-full h-2 bg-surface rounded-lg mb-8 mt-2">
                {/* Colored Track */}
                <div 
                  className="absolute h-full bg-primary rounded-lg"
                  style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                ></div>
                
                {/* Min Thumb */}
                <input
                  type="range"
                  name="minPrice"
                  min={minLimit}
                  max={maxLimit}
                  step="10000"
                  value={currentMin}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), currentMax);
                    onFilterChange('minPrice', val);
                  }}
                  className={sliderClassName}
                  style={{ zIndex: currentMin > maxLimit - 10000 ? 5 : 3 }}
                />

                {/* Max Thumb */}
                <input
                  type="range"
                  name="maxPrice"
                  min={minLimit}
                  max={maxLimit}
                  step="10000"
                  value={currentMax}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), currentMin);
                    onFilterChange('maxPrice', val);
                  }}
                  className={sliderClassName}
                  style={{ zIndex: 4 }}
                />
              </div>
            );
          })()}
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="number" 
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleChange}
                placeholder="Min Price"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary pr-8"
              />
              <span className="absolute right-4 top-3.5 text-text-muted font-medium">₹</span>
            </div>
            <div className="relative flex-1">
              <input 
                type="number" 
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleChange}
                placeholder="Max Price"
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary pr-8"
              />
              <span className="absolute right-4 top-3.5 text-text-muted font-medium">₹</span>
            </div>
          </div>
        </div>

        {/* Type / Category */}
        <div>
          <h3 className="text-base font-medium text-text-main mb-4">Type</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const currentCategories = filters.category ? filters.category.toLowerCase().split(',') : [];
              const isActive = currentCategories.includes(cat.toLowerCase());
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const newCats = isActive 
                      ? currentCategories.filter(c => c !== cat.toLowerCase())
                      : [...currentCategories, cat.toLowerCase()];
                    onFilterChange('category', newCats.join(','));
                  }}
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
              const currentColors = filters.color ? filters.color.split(',') : [];
              const isActive = currentColors.includes(color.label);
              return (
                <button
                  key={color.label}
                  onClick={() => {
                    if (color.label === 'All Colors') {
                      onFilterChange('color', '');
                      return;
                    }
                    const newColors = isActive 
                      ? currentColors.filter(c => c !== color.label)
                      : [...currentColors.filter(c => c !== 'All Colors'), color.label];
                    onFilterChange('color', newColors.join(','));
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive 
                      ? 'bg-primary border-primary text-gray-900 shadow-sm' 
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
