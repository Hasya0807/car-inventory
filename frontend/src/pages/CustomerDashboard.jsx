import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Heart, Clock, User, Settings, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../context/ToastContext';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wishlist');

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

    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch (e) {}

  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[60vh]">
        <div className="text-text-muted font-medium animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'wishlist', label: 'My Garage (Saved)', icon: <Heart size={18} /> },
    { id: 'recent', label: 'Recently Viewed', icon: <Clock size={18} /> }
  ];

  return (
    <div className="w-full bg-surface min-h-[80vh]">
      {/* Dashboard Header / Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm relative group shrink-0">
               <User size={40} />
               <button className="absolute bottom-0 right-0 bg-card border border-border p-1.5 rounded-full text-text-muted hover:text-primary transition-colors shadow-sm">
                 <Settings size={14} />
               </button>
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-1">Welcome back, {user?.name.split(' ')[0]}!</h1>
              <p className="text-text-muted text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online • Premium Member
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link to="/" className="bg-primary text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap">
              Browse Inventory
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex-1 lg:flex-none justify-center lg:justify-start",
                  activeTab === tab.id 
                    ? "bg-primary text-gray-900 shadow-sm"
                    : "text-text-muted hover:bg-card hover:text-text-main"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-main">My Garage (Saved Vehicles)</h2>
                <span className="bg-card border border-border text-text-main px-3 py-1 rounded-full text-sm font-bold shadow-sm">{wishlist.length} Cars</span>
              </div>
              
              {wishlist.length === 0 ? (
                <div className="bg-card rounded-3xl p-10 md:p-16 text-center border border-border border-dashed flex flex-col items-center">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {wishlist.map(vehicle => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RECENTLY VIEWED TAB */}
          {activeTab === 'recent' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-text-main mb-6">Recently Viewed</h2>
              {recentlyViewed.length === 0 ? (
                <div className="bg-card rounded-3xl p-10 md:p-16 text-center border border-border border-dashed flex flex-col items-center">
                  <Clock size={48} className="text-border mb-6" />
                  <h3 className="text-lg font-bold text-text-main mb-2">No history yet</h3>
                  <p className="text-text-muted max-w-sm">
                    Vehicles you browse will appear here so you can easily find them again.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentlyViewed.map(vehicle => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
