import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Heart, Clock, User, Package, LayoutDashboard, Car, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../context/ToastContext';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'overview';

  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Sync tab when location search changes
    const tabParam = new URLSearchParams(location.search).get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wishlistRes, purchasesRes, testDrivesRes] = await Promise.all([
          api.get('/wishlist').catch(() => null),
          api.get('/purchases/me').catch(() => null),
          api.get('/test-drives/me').catch(() => null)
        ]);

        if (wishlistRes && wishlistRes.data.success) {
          setWishlist(wishlistRes.data.data);
        }
        if (purchasesRes && purchasesRes.data.success) {
          setPurchases(purchasesRes.data.data);
        }
        if (testDrivesRes && testDrivesRes.data.success) {
          setTestDrives(testDrivesRes.data.data);
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
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'recent', label: 'Recently Viewed', icon: <Clock size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
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
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-text-muted uppercase tracking-wider">Saved</div>
                    <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                       <Heart size={20} />
                    </div>
                  </div>
                  <div className="text-4xl font-display font-bold text-text-main">{wishlist.length}</div>
                </div>
                
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-text-muted uppercase tracking-wider">Viewed</div>
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                       <Clock size={20} />
                    </div>
                  </div>
                  <div className="text-4xl font-display font-bold text-text-main">{recentlyViewed.length}</div>
                </div>
        
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-text-muted uppercase tracking-wider">Orders & Bookings</div>
                    <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                       <Package size={20} />
                    </div>
                  </div>
                  <div className="text-4xl font-display font-bold text-text-main">{purchases.length + testDrives.length}</div>
                </div>
              </div>

              {/* Mini Preview of Wishlist */}
              {wishlist.length > 0 && (
                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                      <Heart size={20} className="text-red-500" />
                      Recent Additions to Garage
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.slice(0, 2).map(vehicle => (
                      <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Preview of Test Drives */}
              {testDrives.length > 0 && (
                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                      <Clock size={20} className="text-blue-500" />
                      Upcoming Appointments
                    </h2>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-primary hover:underline">View All &rarr;</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testDrives.slice(0, 2).map(drive => (
                      <div key={drive._id} className="bg-surface rounded-2xl border border-border p-4 flex gap-4 shadow-sm items-center">
                        {drive.vehicleId?.imageUrl ? (
                          <img src={drive.vehicleId.imageUrl} alt={drive.vehicleId?.make} className="w-20 h-20 object-contain rounded-lg bg-card" />
                        ) : (
                          <div className="w-20 h-20 bg-card rounded-lg flex items-center justify-center text-text-muted">
                            <Car size={24} />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-text-main line-clamp-1">{drive.vehicleId?.make} {drive.vehicleId?.model}</h4>
                          <div className="text-sm font-medium text-text-muted mt-1">{new Date(drive.date).toLocaleDateString()}</div>
                          <div className="text-primary font-bold mt-0.5">{drive.slot}</div>
                        </div>
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">
                          {drive.status || 'Scheduled'}
                        </div>
                      </div>
                    ))}
                  </div>
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

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-text-main mb-6">My Orders & Test Drives</h2>
              
              {purchases.length === 0 && testDrives.length === 0 ? (
                <div className="bg-card rounded-3xl p-10 md:p-16 text-center border border-border border-dashed flex flex-col items-center">
                  <Package size={64} className="text-border mb-6" />
                  <h3 className="text-xl font-bold text-text-main mb-2">Order History</h3>
                  <p className="text-text-muted max-w-md">
                    You haven't placed any vehicle reservations or scheduled test drives yet. When you do, you'll be able to track them all right here.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {purchases.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <Package size={18} className="text-green-500" />
                        Purchased Vehicles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {purchases.map(purchase => (
                          <div key={purchase._id} className="relative">
                            <VehicleCard vehicle={purchase.vehicleId} />
                            <div className="absolute top-4 left-4 bg-green-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                              Purchased
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {testDrives.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        Upcoming Test Drives
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testDrives.map(drive => (
                          <div key={drive._id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 shadow-sm items-center">
                            {drive.vehicleId?.imageUrl ? (
                              <img src={drive.vehicleId.imageUrl} alt={drive.vehicleId.make} className="w-24 h-24 object-contain" />
                            ) : (
                              <div className="w-24 h-24 bg-surface rounded-xl flex items-center justify-center text-text-muted">
                                <Car size={32} />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-bold text-text-main line-clamp-1">{drive.vehicleId?.make} {drive.vehicleId?.model}</h4>
                              <div className="text-sm font-medium text-text-muted mt-1">{drive.date}</div>
                              <div className="text-primary font-bold mt-0.5">{drive.slot}</div>
                            </div>
                            <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">
                              {drive.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
