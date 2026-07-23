import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Heart, Maximize, ShieldCheck, Wrench, Navigation, CreditCard, Car, Fuel, Settings2, Users, MapPin, Calendar as CalendarIcon, FileText, X } from 'lucide-react';
import { cn } from '../context/ToastContext';
import { Modal } from '../components/ui/Modal';
import { VehicleCard } from '../components/vehicles/VehicleCard';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, wishlistedIds, toggleWishlistId } = useAuth() || { user: null, wishlistedIds: new Set(), toggleWishlistId: () => {} };
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [contactNumber, setContactNumber] = useState('');

  const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const isWishlisted = wishlistedIds?.has(id);

  useEffect(() => {
    if (selectedDate && id) {
      const fetchSlots = async () => {
        try {
          const res = await api.get(`/test-drives/${id}/booked-slots?date=${selectedDate}`);
          if (res.data && res.data.success) {
            setBookedSlots(res.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, id]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
        
        // Fetch similar vehicles
        try {
          const similarRes = await vehicleService.getVehicles({ category: data.category, limit: 5 });
          if (similarRes.data) {
            setSimilarVehicles(similarRes.data.filter(v => v._id !== data._id).slice(0, 4));
          }
        } catch (e) {
          console.error('Failed to load similar vehicles', e);
        }
        
        // Add to recently viewed in localStorage
        try {
          const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          // Remove if exists, then add to front
          const updatedViewed = [data, ...viewed.filter(v => v._id !== data._id)].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
        } catch (e) {
          console.error('Error saving to recently viewed:', e);
        }

      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load vehicle details', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate, addToast]);

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please log in to book test drives.', 'error');
      navigate('/login');
      return;
    }
    
    if (!selectedDate || !selectedSlot || !contactNumber) {
      addToast('Please fill all fields', 'error');
      return;
    }

    try {
      await api.post('/test-drives/book', {
        vehicleId: id,
        date: selectedDate,
        slot: selectedSlot,
        contactNumber
      });
      addToast('Test drive scheduled successfully! A dealer will contact you.', 'success');
      setIsTestDriveOpen(false);
      setSelectedDate('');
      setSelectedSlot('');
      setContactNumber('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to schedule test drive', 'error');
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      addToast('Please log in to purchase vehicles.', 'error');
      navigate('/login');
      return;
    }
    try {
      await vehicleService.purchaseVehicle(id, 1);
      addToast('Vehicle purchased successfully!', 'success');
      // Update local state temporarily to reflect purchase
      setVehicle(prev => ({ ...prev, quantity: prev.quantity - 1 }));
      navigate('/dashboard?tab=orders');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to purchase vehicle', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      addToast('Please log in to save vehicles.', 'error');
      navigate('/login');
      return;
    }

    try {
      await vehicleService.toggleWishlist(id);
      toggleWishlistId(id);
      addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update wishlist', 'error');
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
    <>
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
          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
            <div className="text-sm font-medium text-text-muted mb-2">
              Interested in this vehicle?
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setIsTestDriveOpen(true)}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isOutOfStock 
                    ? "bg-surface text-text-muted border border-border cursor-not-allowed shadow-none" 
                    : "bg-surface text-text-main border border-border hover:bg-card hover:shadow-md"
                )}
              >
                <CalendarIcon size={18} />
                {isOutOfStock ? 'Unavailable' : 'Book Test Drive'}
              </button>
              
              <button 
                onClick={handlePurchase}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isOutOfStock 
                    ? "bg-surface text-text-muted border border-border cursor-not-allowed shadow-none" 
                    : "bg-primary text-gray-900 hover:bg-primary-dark hover:shadow-md hover:scale-105"
                )}
              >
                <FileText size={18} />
                {isOutOfStock ? 'Sold Out' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Image and Map */}
      <div className="w-full xl:w-3/5 flex flex-col gap-6">
        
        {/* Car Image Area */}
        <div className="relative bg-transparent flex items-center justify-center h-[400px] xl:h-[500px]">
          {/* Floating Icons */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button 
              onClick={() => vehicle.imageUrl && setIsLightboxOpen(true)}
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-text-main shadow hover:scale-110 transition-transform"
            >
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
              onClick={() => setIsLightboxOpen(true)}
              className="w-full h-full object-contain drop-shadow-2xl scale-110 cursor-pointer hover:scale-[1.12] transition-transform duration-300" 
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
            <button 
              onClick={() => window.open('https://maps.google.com/?q=Ahmedabad', '_blank')}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-main transition-colors"
            >
               <Maximize size={14} />
            </button>
          </div>
          <div className="flex-1 bg-surface rounded-2xl overflow-hidden relative min-h-[250px]">
            <iframe 
              src="https://maps.google.com/maps?q=Ahmedabad&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '250px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Dealership Location"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
    
    {/* Similar Vehicles Section */}
    {similarVehicles.length > 0 && (
      <div className="w-full mt-16 mb-8">
        <h2 className="text-2xl font-bold font-display text-text-main mb-6 flex items-center gap-2">
          <Car size={24} className="text-primary" />
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarVehicles.map(v => (
            <VehicleCard 
              key={v._id} 
              vehicle={v} 
              onPurchase={() => navigate(`/vehicles/${v._id}`)} 
              isAdmin={false} 
            />
          ))}
        </div>
      </div>
    )}

    {/* Test Drive Modal */}
    <Modal isOpen={isTestDriveOpen} onClose={() => setIsTestDriveOpen(false)} title="Schedule a Test Drive">
        <form onSubmit={handleTestDriveSubmit} className="space-y-4">
          <p className="text-sm text-text-muted mb-4">Select a date and time that works for you. Our team will contact you to confirm.</p>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Preferred Date</label>
            <input 
              type="date" 
              required 
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(''); // Reset slot when date changes
              }}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto hide-scrollbar pr-2">
                {TIME_SLOTS.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                        isBooked 
                          ? "bg-surface text-text-muted border-border cursor-not-allowed opacity-50" 
                          : isSelected 
                            ? "bg-primary text-gray-900 border-primary" 
                            : "bg-card text-text-main border-border hover:border-primary hover:text-primary"
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1 mt-2">Contact Number</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 000-0000" 
              required 
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          <button 
            type="submit" 
            disabled={!selectedDate || !selectedSlot}
            className="w-full bg-primary text-gray-900 font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Test Drive
          </button>
        </form>
      </Modal>

      {/* Lightbox Modal */}
      {isLightboxOpen && vehicle.imageUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-[101]"
          >
            <X size={24} />
          </button>
          <img 
            src={vehicle.imageUrl} 
            alt="Vehicle fullscreen" 
            className="max-w-[95vw] max-h-[90vh] object-contain animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </>
  );
};
