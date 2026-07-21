import React, { useState } from 'react';
import { cn } from '../context/ToastContext';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { FilterRail } from '../components/vehicles/FilterRail';
import { Pagination } from '../components/vehicles/Pagination';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';

import { Filter } from 'lucide-react';

import { BookingHero } from '../components/vehicles/BookingHero';

export const InventoryPage = () => {
  const { vehicles, loading, error, meta, filters, updateFilter, clearFilters, page, setPage, refresh } = useVehicles();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchTerm);
  };

  const handlePurchase = async (id) => {
    try {
      await vehicleService.purchaseVehicle(id, 1);
      addToast('Vehicle purchased successfully!', 'success');
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to purchase vehicle', 'error');
    }
  };

  const handleHeroSearch = (filters) => {
    Object.keys(filters).forEach(key => updateFilter(key, filters[key]));
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 w-full mx-auto py-8 flex flex-col relative">
        <BookingHero onSearch={handleHeroSearch} />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-bold text-chrome">Inventory</h1>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-charcoal border border-gray-700 px-3 py-1.5 rounded text-sm text-chrome focus:outline-none focus:ring-1 focus:ring-ignition"
          >
            <Filter size={16} /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filter Rail - hidden on mobile unless toggled */}
        <div className={cn(
          "md:block",
          showMobileFilters ? "block" : "hidden"
        )}>
          <FilterRail 
            filters={filters} 
            onFilterChange={updateFilter} 
            onClear={clearFilters} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="hidden md:block">
              <h1 className="text-2xl font-display font-bold text-chrome">Inventory</h1>
              <p className="text-sm text-graphite mt-1">
                {meta ? `Showing ${vehicles.length} of ${meta.total} vehicles` : 'Loading...'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select 
                value={filters.sort || 'price_asc'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-charcoal border border-gray-700 rounded px-3 py-2 text-sm text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
              >
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-charcoal border border-gray-700 rounded-l px-3 py-2 text-sm text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
                />
                <button 
                  type="submit"
                  className="bg-primary text-gray-900 px-6 py-2 text-sm font-bold rounded-r border border-primary hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {error ? (
            <div className="bg-ignition/10 border border-ignition/30 text-ignition p-4 rounded mb-6">
              {error}
            </div>
          ) : null}

          <VehicleGrid 
            vehicles={vehicles} 
            loading={loading} 
            onPurchase={handlePurchase}
            isAdmin={false}
          />
          
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
        </div>
      </main>
    </div>
  );
};
