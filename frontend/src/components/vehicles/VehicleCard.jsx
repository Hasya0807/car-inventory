import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Maximize } from 'lucide-react'; // using Maximize as a proxy for the 360/VR icon

export const VehicleCard = ({ vehicle, onPurchase, isAdmin, onEdit }) => {
  const isOutOfStock = vehicle.quantity <= 0;
  
  // Mocking some data that the reference UI has but our schema might not
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
  const miles = Math.floor(Math.random() * 1000) + 100;
  const trips = Math.floor(Math.random() * 100) + 10;
  const transmission = vehicle.transmission === 'Automatic' ? 'Auto' : vehicle.transmission === 'Manual' ? 'Manual' : 'Auto';

  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image container */}
      <Link to={`/vehicles/${vehicle._id}`} className="block relative w-full pt-[60%] bg-surface/30 overflow-hidden">
        {vehicle.imageUrl ? (
          <img 
            src={vehicle.imageUrl} 
            alt={`${vehicle.make} ${vehicle.model}`} 
            className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted opacity-30">
            <CarIcon className="w-16 h-16" />
          </div>
        )}
        
        {/* Floating Icons */}
        {!isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center text-text-main shadow-sm hover:scale-110 transition-transform">
              <Maximize size={16} />
            </button>
            <button 
              className="w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center text-text-muted hover:text-red-500 shadow-sm hover:scale-110 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                alert('Wishlist feature coming soon / toggled!');
              }}
            >
              <Heart size={16} />
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          ) : vehicle.quantity <= 2 ? (
            <span className="bg-amber-400 text-amber-950 text-xs px-3 py-1 rounded-full font-medium">
              Low Stock
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <Link to={`/vehicles/${vehicle._id}`} className="block p-6 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-4">
            <h3 className="font-display font-medium text-lg text-text-main group-hover:text-primary-dark transition-colors line-clamp-1">
              {vehicle.make} {vehicle.model} {vehicle.year} - {transmission}
            </h3>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-medium text-xl text-text-main">
              ${vehicle.price.toLocaleString()}
            </span>
            <span className="text-xs text-text-muted">Day</span>
          </div>
        </div>

        {/* Stats footer */}
        <div className="flex items-center gap-4 text-sm text-text-muted font-medium">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-text-main">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
            </svg>
            <span>{miles} miles</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>{trips} trips</span>
          </div>
        </div>
      </Link>

      {/* Admin Edit button below the stats if admin */}
      {isAdmin && (
        <div className="px-6 pb-6 pt-2 mt-auto border-t border-border">
          <button 
            onClick={() => onEdit(vehicle._id)}
            className="w-full py-2 rounded-xl font-medium text-sm bg-surface text-text-main hover:bg-gray-200 transition-colors"
          >
            Edit Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

const CarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
