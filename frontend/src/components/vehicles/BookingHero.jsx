import React from 'react';
import { MapPin, CalendarDays, Clock } from 'lucide-react';

export const BookingHero = () => {
  return (
    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col xl:flex-row gap-8 mb-8">
      {/* Left Text & Badges */}
      <div className="xl:w-1/3 flex flex-col justify-center">
        <h1 className="text-3xl font-medium text-text-main leading-tight mb-3">
          Book Your Ride in Seconds
        </h1>
        <p className="text-text-muted text-sm mb-6 max-w-sm">
          Travel without limits — choose, compare, and rent your ideal car effortlessly.
        </p>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-card bg-gray-300 overflow-hidden">
               <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-full h-full object-cover" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-card bg-gray-300 overflow-hidden">
               <img src="https://i.pravatar.cc/100?img=2" alt="user" className="w-full h-full object-cover" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-card bg-primary flex items-center justify-center text-text-main text-xs font-bold z-10">
              2K+
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
            </div>
            <span className="text-xs text-text-muted mt-1">Trusted by 10M+ users</span>
          </div>
        </div>
      </div>

      {/* Right Form Inputs */}
      <div className="flex-1 border-l border-border pl-0 xl:pl-8 flex flex-col justify-center gap-6">
        
        {/* Row 1: Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <MapPin size={16} className="text-primary-dark" />
              Starting Point
            </label>
            <input 
              type="text" 
              placeholder="Select your pick-up location" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <MapPin size={16} className="text-primary-dark" />
              Return Point
            </label>
            <input 
              type="text" 
              placeholder="Select your drop-off location" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
        </div>

        {/* Row 2: Dates & Times */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <CalendarDays size={16} className="text-primary-dark" />
              Start Date
            </label>
            <input 
              type="text" 
              placeholder="Choose start date" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <CalendarDays size={16} className="text-primary-dark" />
              End Date
            </label>
            <input 
              type="text" 
              placeholder="Choose return date" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <Clock size={16} className="text-primary-dark" />
              Start Time
            </label>
            <input 
              type="text" 
              placeholder="Select pick-up time" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
              <Clock size={16} className="text-primary-dark" />
              Return Time
            </label>
            <input 
              type="text" 
              placeholder="Select drop-off time" 
              className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
