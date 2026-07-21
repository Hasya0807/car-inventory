import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';
import { Heart, Maximize, Calendar, HeadphonesIcon, Navigation, CreditCard, Car, Fuel, Settings2, Users, MapPin } from 'lucide-react';
import { cn } from '../context/ToastContext';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

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
      addToast('Vehicle booked successfully!', 'success');
      const data = await vehicleService.getVehicleById(id);
      setVehicle(data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book vehicle', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted font-medium">Loading details...</div>
      </div>
    );
  }

  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;
  
  // Mock data to match UI
  const rating = "4.8";
  const miles = "560 miles";
  const trips = "52 trips";
  const transmission = vehicle.transmission || 'Automatic';
  const fuel = vehicle.fuel || 'Electric';

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full">
      {/* Left Column: Details */}
      <div className="w-full xl:w-2/5 flex flex-col pt-4">
        
        <h1 className="text-2xl md:text-3xl font-display font-medium text-text-main mb-2">
          {vehicle.make} {vehicle.model} {vehicle.year} – {fuel}
        </h1>
        
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-semibold text-text-main">
            ${vehicle.price.toLocaleString()}
          </span>
          <span className="text-text-muted font-medium">/Day</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-text-main shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-text-main">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            {rating}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-text-main shadow-sm">
             <Car size={16} className="text-text-muted" />
            {miles}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-text-main shadow-sm">
            <Navigation size={16} className="text-text-muted" />
            {trips}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-text-main shadow-sm">
            <Settings2 size={16} className="text-text-muted" />
            {transmission}
          </div>
        </div>

        {/* Smart Ride 1 */}
        <div className="mb-6 bg-card p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-main">Smart Ride</h3>
            <button className="text-text-muted hover:text-text-main transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <Calendar size={18} />
                <span className="font-medium text-sm">Quick Book</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Book instantly</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <HeadphonesIcon size={18} />
                <span className="font-medium text-sm">Customer Care</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Track your ride</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <Navigation size={18} />
                <span className="font-medium text-sm">Live Tracking</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Support 24/7</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1 text-text-main">
                <CreditCard size={18} />
                <span className="font-medium text-sm">Secure Pay</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">Easy payment</span>
            </div>
          </div>
        </div>

        {/* Smart Ride 2 / Specs */}
        <div className="mb-6 bg-card p-6 rounded-3xl border border-border shadow-sm flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-main">Smart Ride</h3>
            <button className="text-text-muted hover:text-text-main transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-auto">
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-main">
                <Car size={18} />
                <span className="font-medium text-sm">Model Type</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5 capitalize">{vehicle.category}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-main">
                <Fuel size={18} />
                <span className="font-medium text-sm">Fuel Efficiency</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">{fuel}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-main">
                <Settings2 size={18} />
                <span className="font-medium text-sm">Transmission</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">{transmission}</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1 text-text-main">
                <Users size={18} />
                <span className="font-medium text-sm">Capacity</span>
              </div>
              <span className="text-xs text-text-muted pl-6.5">5 seats</span>
            </div>
          </div>
          
          {/* Action Footer inside the card */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-sm font-medium text-text-muted">
              Schedule this ride for <span className="text-text-main underline decoration-gray-300 underline-offset-4">10:00 AM</span>
            </div>
            <button 
              onClick={handlePurchase}
              disabled={isOutOfStock}
              className={cn(
                "px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isOutOfStock 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105"
              )}
            >
              {isOutOfStock ? 'Unavailable' : 'Confirm'}
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
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-text-muted hover:text-red-500 shadow hover:scale-110 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                alert('Wishlist feature toggled!');
              }}
            >
              <Heart size={20} />
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
            <h3 className="text-xl font-medium text-text-main">My Location</h3>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-main transition-colors">
               <Maximize size={14} />
            </button>
          </div>
          <div className="flex-1 bg-surface rounded-2xl overflow-hidden relative min-h-[250px]">
            {/* Map Placeholder Image */}
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=14&size=800x400&maptype=roadmap&sensor=false')] bg-cover bg-center opacity-70 grayscale"></div>
            {/* Custom overlay marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-card text-text-main font-semibold text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 mb-1 border border-border">
                <MapPin size={16} className="text-primary-dark" />
                Current Location
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-card drop-shadow-md"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
