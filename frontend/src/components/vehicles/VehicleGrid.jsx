import React from 'react';
import { VehicleCard } from './VehicleCard';

export const VehicleGrid = ({ vehicles, loading, onPurchase, isAdmin, onEdit }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-charcoal rounded-lg h-64 border border-gray-800 animate-pulse"
            style={{ animationDelay: `${i * 30}ms` }}
          />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-graphite border border-dashed border-gray-800 rounded-lg">
        <p className="text-lg">No vehicles found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle, index) => (
        <div 
          key={vehicle._id} 
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
          style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
        >
          <VehicleCard 
            vehicle={vehicle} 
            onPurchase={onPurchase} 
            isAdmin={isAdmin}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};
