import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Heart, Maximize, ShieldCheck, Wrench, Navigation, CreditCard, Car, Fuel, Settings2, Users, MapPin } from 'lucide-react';
import { cn } from '../context/ToastContext';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load vehicle details', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate, addToast]);

  const handlePurchase = async () => {
    try {
      await vehicleService.purchaseVehicle(id, 1);
      addToast('Vehicle purchased successfully!', 'success');
      const data = await vehicleService.getVehicleById(id);
      setVehicle(data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to purchase vehicle', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const res = await vehicleService.toggleWishlist(id);
      if (res.action === 'added') {
        setIsWishlisted(true);
        addToast('Added to wishlist', 'success');
      } else {
        setIsWishlisted(false);
        addToast('Removed from wishlist');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update wishlist. Please login.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="text-text-muted font-medium">Loading details...</div>
      </div>
    );
  }

  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;
  
  // Mock data for UI
  const transmission = vehicle.transmission || 'Automatic';
  const fuel = vehicle.fuel || 'Petrol';
  const mileage = Math.floor(Math.random() * 50000) + 1000;

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full mt-4">
      {/* Left Column: Details */}
      <div className="w-full xl:w-2/5 flex flex-col pt-4">
        
        <h1 className="text-2xl md:text-4xl font-display font-bold text-text-main mb-2 leading-tight">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </h1>
        
        <div className="flex items-baseline gap-3 mb-8">
          <span className="text-4xl font-semibold text-text-main">
            {formatCurrency(vehicle.price)}
          </span>
          <span className="text-sm font-medium text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
            VIN: {vehicle._id.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-text-main shadow-sm">
             <Car size={18} className="text-text-muted" />
             {vehicle.category}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-text-main shadow-sm">
            <Navigation size={18} className="text-text-muted" />
            {mileage.toLocaleString()} mi
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-text-main shadow-sm">
            <Settings2 size={18} className="text-text-muted" />
            {transmission}
          </div>
        </div>

        {/* Dealership Assurances */}
        <div className="mb-6 bg-card p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-main">DriveMatch Promise</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <ShieldCheck size={18} className="text-primary-dark" />
                <span className="font-bold text-sm">Certified Pre-Owned</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">150-point inspection passed</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <Wrench size={18} className="text-primary-dark" />
                <span className="font-bold text-sm">Warranty Included</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">3-months / 3k miles</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <Navigation size={18} className="text-primary-dark" />
                <span className="font-bold text-sm">Free Delivery</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Within 50 miles</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <CreditCard size={18} className="text-primary-dark" />
                <span className="font-bold text-sm">Flexible Financing</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Rates as low as 4.9%</span>
            </div>
          </div>
        </div>

        {/* Specs Overview */}
        <div className="mb-6 bg-card p-6 rounded-3xl border border-border shadow-sm flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-text-main">Specifications</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-auto">
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-muted">
                <Car size={16} />
                <span className="font-medium text-xs uppercase tracking-wider">Make</span>
              </div>
              <span className="text-sm text-text-main font-bold pl-6">{vehicle.make}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-muted">
                <Fuel size={16} />
                <span className="font-medium text-xs uppercase tracking-wider">Fuel Type</span>
              </div>
              <span className="text-sm text-text-main font-bold pl-6">{fuel}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-muted">
                <Settings2 size={16} />
                <span className="font-medium text-xs uppercase tracking-wider">Transmission</span>
              </div>
              <span className="text-sm text-text-main font-bold pl-6">{transmission}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-muted">
                <Users size={16} />
                <span className="font-medium text-xs uppercase tracking-wider">Stock</span>
              </div>
              <span className="text-sm text-text-main font-bold pl-6">{vehicle.quantity} Units Available</span>
            </div>
          </div>
          
          {/* Purchase Footer inside the card */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <div className="text-sm font-medium text-text-muted">
              Ready to buy?
            </div>
            <button 
              onClick={handlePurchase}
              disabled={isOutOfStock}
              className={cn(
                "px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isOutOfStock 
                  ? "bg-surface text-text-muted border border-border cursor-not-allowed shadow-none" 
                  : "bg-primary text-text-main hover:bg-primary-dark hover:shadow-md hover:scale-105"
              )}
            >
              {isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Image and Map */}
      <div className="w-full xl:w-3/5 flex flex-col gap-6">
        
        {/* Car Image Area */}
        <div className="relative bg-transparent flex items-center justify-center h-[400px] xl:h-[500px]">
          {/* Floating Icons */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-text-main shadow hover:scale-110 transition-transform">
              <Maximize size={20} />
            </button>
            <button 
              className={cn(
                "w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform",
                isWishlisted ? "text-red-500" : "text-text-muted hover:text-red-500"
              )}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} />
            </button>
          </div>

          {vehicle.imageUrl ? (
            <img 
              src={vehicle.imageUrl} 
              alt={`${vehicle.make} ${vehicle.model}`} 
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl scale-110" 
            />
          ) : (
            <div className="text-text-muted opacity-20 flex flex-col items-center">
              <Car size={120} />
              <span className="mt-4 font-medium text-xl">Image Unavailable</span>
            </div>
          )}
        </div>

        {/* My Location Block */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-text-main">Dealership Location</h3>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-main transition-colors">
               <Maximize size={14} />
            </button>
          </div>
          <div className="flex-1 bg-surface rounded-2xl overflow-hidden relative min-h-[250px]">
            {/* Map Placeholder Image */}
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Los+Angeles,CA&zoom=13&size=800x400&maptype=roadmap&sensor=false')] bg-cover bg-center opacity-70 grayscale"></div>
            {/* Custom overlay marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center hover:-translate-y-2 transition-transform cursor-pointer">
              <div className="bg-card text-text-main font-bold text-sm px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 mb-1 border border-border">
                <MapPin size={18} className="text-primary-dark" />
                DriveMatch Showroom
              </div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-card drop-shadow-md"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
