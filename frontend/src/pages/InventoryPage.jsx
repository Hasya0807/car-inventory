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
import { FeaturedCarousel } from '../components/vehicles/FeaturedCarousel';

export const InventoryPage = () => {
  const { vehicles, loading, error, meta, filters, updateFilter, clearFilters, page, setPage, refresh } = useVehicles();
  const { addToast } = useToast();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        <FeaturedCarousel />
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
          "md:block md:sticky md:top-8 self-start",
          showMobileFilters ? "block" : "hidden"
        )}>
          <FilterRail 
            filters={filters} 
            onFilterChange={updateFilter} 
            onClear={clearFilters} 
            meta={meta}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="hidden md:block">
              <h1 className="text-2xl font-display font-bold text-chrome">Inventory</h1>
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
