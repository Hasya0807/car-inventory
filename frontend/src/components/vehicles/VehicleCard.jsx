import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Settings2, Info, Droplet } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';

export const VehicleCard = ({ vehicle, onPurchase, isAdmin, onEdit }) => {
  const { user, wishlistedIds, toggleWishlistId } = useAuth() || { user: null, wishlistedIds: new Set(), toggleWishlistId: () => {} };
  const navigate = useNavigate();

  const isFavorite = wishlistedIds?.has(vehicle._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please log in to save vehicles to your garage.', 'error');
      navigate('/login');
      return;
    }
    
    try {
      await api.post(`/vehicles/${vehicle._id}/wishlist`);
      toggleWishlistId(vehicle._id);
      addToast(isFavorite ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update wishlist', 'error');
    }
  };

  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image container */}
      <Link to={`/vehicles/${vehicle._id}`} className="block relative w-full pt-[60%] bg-surface/10 overflow-hidden">
        {vehicle.imageUrl ? (
          <img 
            src={vehicle.imageUrl} 
            alt={`${vehicle.make} ${vehicle.model}`} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted opacity-30">
            <CarIcon className="w-16 h-16" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {vehicle.quantity === 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Sold Out
            </span>
          )}
          {vehicle.year >= 2024 && (
            <span className="bg-primary text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button (non-admin) */}
        {!isAdmin && (
          <button 
            onClick={handleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${isFavorite ? 'text-red-500' : 'text-text-muted hover:text-red-500'}`}
          >
            <Heart size={20} className={isFavorite ? "fill-red-500" : ""} />
          </button>
        )}
      </Link>

      {/* Content */}
      <Link to={`/vehicles/${vehicle._id}`} className="block p-6 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm font-medium text-text-muted mt-1">{vehicle.year} • {vehicle.category}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-text-main whitespace-nowrap">
              {formatCurrency(vehicle.price)}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-text-muted mb-6 font-medium">
          <div className="flex items-center gap-1.5" title="Transmission">
             <Settings2 size={16} />
             <span>{vehicle.transmission || 'Auto'}</span>
          </div>
          {vehicle.mileage !== undefined && (
            <div className="flex items-center gap-1.5" title="Mileage">
               <Info size={16} />
               <span>{vehicle.mileage} {vehicle.fuel === 'Electric' ? 'mi' : 'kmpl'}</span>
            </div>
          )}
          {vehicle.color && (
            <div className="flex items-center gap-1.5" title="Color">
               <Droplet size={16} />
               <span>{vehicle.color}</span>
            </div>
          )}
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
