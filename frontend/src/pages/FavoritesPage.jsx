import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Car, Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setWishlist(res.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch wishlist', e);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="w-full bg-surface min-h-[80vh] flex flex-col">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border-4 border-surface shadow-sm shrink-0">
             <Heart size={40} className="fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-text-main mb-1">My Favorites</h1>
            <p className="text-text-muted text-sm">Vehicles you have saved to your garage.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-text-muted font-medium animate-pulse">Loading favorites...</div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-card rounded-3xl p-10 md:p-16 text-center border border-border border-dashed flex flex-col items-center mt-8">
            <Car size={64} className="text-border mb-6" />
            <h3 className="text-xl font-bold text-text-main mb-2">Your garage is empty</h3>
            <p className="text-text-muted max-w-md mb-8">
              Keep track of the cars you love. Click the heart icon on any vehicle in the inventory to park it here.
            </p>
            <Link to="/" className="bg-primary text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors shadow-sm">
              Explore Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {wishlist.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} isAdmin={false} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
