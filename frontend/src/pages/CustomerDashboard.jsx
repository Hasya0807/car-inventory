import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Heart, Clock, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await api.get('/wishlist').catch(() => null);

        if (wishlistRes && wishlistRes.data.success) {
          setWishlist(wishlistRes.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    // Load recently viewed from localStorage (we just simulate this here or empty)
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch (e) {}

  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-text-muted font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="py-8 w-full max-w-7xl mx-auto space-y-12">
      
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface">
           <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main mb-1">Hello, {user?.name}</h1>
          <p className="text-text-muted text-sm">{user?.email}</p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
             <Heart size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-main">{wishlist.length}</div>
            <div className="text-sm text-text-muted font-medium">Saved Vehicles</div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
             <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-main">{recentlyViewed.length}</div>
            <div className="text-sm text-text-muted font-medium">Recently Viewed</div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4 opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
             <Package size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-main">0</div>
            <div className="text-sm text-text-muted font-medium">My Orders</div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <section>
        <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Heart className="text-red-500" /> Your Wishlist
          </h2>
          <Link to="/" className="text-sm font-medium text-primary-dark hover:underline">
            Browse Inventory &rarr;
          </Link>
        </div>
        
        {wishlist.length === 0 ? (
          <div className="bg-card rounded-3xl p-12 text-center border border-border border-dashed">
            <Heart size={48} className="mx-auto text-border mb-4" />
            <h3 className="text-lg font-medium text-text-main mb-2">No saved vehicles yet</h3>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
              Keep track of the cars you love. Click the heart icon on any vehicle to add it to your wishlist.
            </p>
            <Link to="/" className="inline-flex bg-primary text-text-main font-bold px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors">
              Explore Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Clock className="text-text-muted" /> Recently Viewed
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
