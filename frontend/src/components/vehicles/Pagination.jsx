import React from 'react';
import { cn } from '../../context/ToastContext';

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={meta.page === 1}
        className="px-3 py-1 rounded bg-charcoal border border-gray-700 text-chrome disabled:opacity-50 hover:bg-gray-800 transition-colors"
      >
        &larr; Prev
      </button>
      
      <div className="flex items-center gap-1 font-mono text-sm">
        <span className="text-chrome px-2 py-1">{meta.page}</span>
        <span className="text-graphite">/</span>
        <span className="text-graphite px-2 py-1">{meta.pages}</span>
      </div>

      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={meta.page === meta.pages}
        className="px-3 py-1 rounded bg-charcoal border border-gray-700 text-chrome disabled:opacity-50 hover:bg-gray-800 transition-colors"
      >
        Next &rarr;
      </button>
    </div>
  );
};
