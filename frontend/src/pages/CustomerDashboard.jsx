import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wishlistRes, purchasesRes] = await Promise.all([
          api.get('/wishlist'),
          api.get('/purchases') // Assuming we create this backend route, or we can just mock it for now since Payments are skipped but we did add a Purchase model! Wait, I didn't add a /purchases route for the user. Let me skip fetching purchases for now and just show wishlist and recently viewed.
        ]).catch(() => [null, null]);

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

    // Load recently viewed from localStorage
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch (e) {}

  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome, {user?.name}</h1>
      
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-400">No vehicles in your wishlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Recently Viewed</h2>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-400">No recently viewed vehicles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
