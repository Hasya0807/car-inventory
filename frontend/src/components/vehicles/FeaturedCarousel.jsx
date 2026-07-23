import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import vehicleService from '../../services/vehicle.service';
import { formatCurrency } from '../../utils/formatCurrency';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedCarousel = () => {
  const [featured, setFeatured] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await vehicleService.getVehicles({ isFeatured: true, limit: 5 });
        if (response.data && response.data.length > 0) {
          setFeatured(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured vehicles', error);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const currentVehicle = featured[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-surface overflow-hidden mb-12 rounded-3xl shadow-xl group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url(${currentVehicle.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-24">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-primary text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            Featured
          </span>
          <span className="px-3 py-1 bg-surface/30 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {currentVehicle.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">
          {currentVehicle.year} {currentVehicle.make} <br className="hidden md:block" />
          <span className="text-primary">{currentVehicle.model}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl font-light">
          {currentVehicle.description || `Experience the thrill of the ${currentVehicle.make} ${currentVehicle.model}. Now available for a test drive.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link 
            to={`/vehicles/${currentVehicle._id}`}
            className="px-8 py-3.5 bg-primary text-gray-900 hover:bg-primary-dark font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            Explore Vehicle
          </Link>
          <div className="text-white">
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Starting at</p>
            <p className="text-2xl md:text-3xl font-bold font-mono">{formatCurrency(currentVehicle.price)}</p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {featured.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/40 hover:bg-primary backdrop-blur-md text-white hover:text-gray-900 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/40 hover:bg-primary backdrop-blur-md text-white hover:text-gray-900 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
