import React from 'react';
import { Search, CarFront, ShieldCheck, Banknote } from 'lucide-react';

export const BookingHero = () => {
  return (
    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col xl:flex-row gap-8 mb-8">
      {/* Left Text & Badges */}
      <div className="xl:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl font-display font-bold text-text-main leading-tight mb-4">
          Find Your Dream Car Today
        </h1>
        <p className="text-text-muted text-base mb-8 max-w-lg">
          Explore our premium selection of certified pre-owned and new vehicles. Quality guaranteed, transparent pricing, and exceptional service.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary-dark">
                <CarFront size={24} />
             </div>
             <div>
               <div className="font-bold text-text-main">500+</div>
               <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Vehicles</div>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary-dark">
                <ShieldCheck size={24} />
             </div>
             <div>
               <div className="font-bold text-text-main">Certified</div>
               <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Quality</div>
             </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary-dark">
                <Banknote size={24} />
             </div>
             <div>
               <div className="font-bold text-text-main">Finance</div>
               <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Available</div>
             </div>
           </div>
        </div>
      </div>

      {/* Right Search Input placeholder for hero */}
      <div className="flex-1 xl:border-l xl:border-border pl-0 xl:pl-8 flex flex-col justify-center">
        <div className="bg-surface p-8 rounded-2xl border border-border">
          <h2 className="text-xl font-semibold text-text-main mb-6">Quick Search</h2>
          
          <div className="space-y-4">
             <div className="flex gap-4">
                <select className="flex-1 appearance-none bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-medium">
                  <option>Any Make</option>
                  <option>Toyota</option>
                  <option>Chevrolet</option>
                  <option>Tesla</option>
                  <option>BMW</option>
                </select>
                <select className="flex-1 appearance-none bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-medium">
                  <option>Any Body Style</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Truck</option>
                </select>
             </div>
             
             <div className="relative">
               <input 
                 type="text"
                 placeholder="Search by model or keywords..."
                 className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
               />
               <Search size={18} className="absolute left-4 top-3.5 text-text-muted" />
             </div>

             <button className="w-full bg-primary text-text-main font-bold rounded-xl py-3 mt-2 hover:bg-primary-dark transition-colors shadow-sm">
               Search Inventory
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
