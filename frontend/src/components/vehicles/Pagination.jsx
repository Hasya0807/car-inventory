import React from 'react';
import { cn } from '../../context/ToastContext';

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center mt-12 mb-8 space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            meta.page === 1 
              ? 'bg-card border border-border text-gray-500 opacity-50 cursor-not-allowed' 
              : 'bg-card border border-border text-text-main hover:bg-primary hover:text-gray-900 hover:border-primary shadow-sm'
          }`}
        >
          &larr; Previous
        </button>
        
        <div className="flex items-center gap-2 font-medium text-sm bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="text-text-main">{meta.page}</span>
          <span className="text-gray-500">of</span>
          <span className="text-text-main">{meta.totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            meta.page >= meta.totalPages 
              ? 'bg-card border border-border text-gray-500 opacity-50 cursor-not-allowed' 
              : 'bg-card border border-border text-text-main hover:bg-primary hover:text-gray-900 hover:border-primary shadow-sm'
          }`}
        >
          Next &rarr;
        </button>
      </div>
      
      {meta.page >= meta.totalPages && (
        <p className="text-sm text-gray-400 italic">No more cars available.</p>
      )}
    </div>
  );
};
