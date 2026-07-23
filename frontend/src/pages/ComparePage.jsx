import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Car, Scale, CheckCircle2 } from 'lucide-react';
import { cn } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';

export const ComparePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles?limit=100'); // Just fetch a bunch for easy comparison selection
        if (res.data.success) {
          setVehicles(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert("You can only compare up to 4 vehicles");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedVehicles = selectedIds.map(id => vehicles.find(v => v._id === id)).filter(Boolean);

  if (loading) return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="text-text-muted font-medium">Loading vehicles...</div>
    </div>
  );

  return (
    <div className="py-8 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-text-main mb-2">Compare Vehicles</h1>
        <p className="text-text-muted">Select up to 4 vehicles to compare their specifications side-by-side.</p>
      </div>
      
      {/* Selection Area */}
      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Car size={20} className="text-primary-dark" /> Select Inventory
          </h2>
          <span className="text-sm font-medium text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
            {selectedIds.length} / 4 Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {(showAll ? vehicles : vehicles.slice(0, 15)).map(v => {
            const isSelected = selectedIds.includes(v._id);
            return (
              <button 
                key={v._id} 
                onClick={() => toggleSelect(v._id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 shadow-sm",
                  isSelected 
                    ? "bg-primary text-gray-900 border-primary shadow-md hover:brightness-110" 
                    : "bg-surface text-text-muted border-border hover:text-text-main hover:border-gray-400"
                )}
              >
                {isSelected && <CheckCircle2 size={16} />}
                {v.make} {v.model}
              </button>
            );
          })}
          
          {vehicles.length > 15 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-full text-sm font-bold transition-all border border-dashed border-border text-text-main hover:border-primary hover:text-primary"
            >
              {showAll ? "Show Less" : `+ ${vehicles.length - 15} More Cars`}
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedVehicles.length > 0 ? (
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="p-6 border-r border-border min-w-[150px]">
                    <div className="flex items-center gap-2 text-text-muted font-medium text-sm uppercase tracking-wider">
                      <Scale size={16} /> Features
                    </div>
                  </th>
                  {selectedVehicles.map(v => (
                    <th key={v._id} className="p-6 border-r border-border last:border-0 min-w-[200px] text-center">
                      <div className="font-display font-bold text-xl text-text-main leading-tight mb-1">
                        {v.make}
                      </div>
                      <div className="text-sm font-medium text-text-muted">
                        {v.model}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Price', key: 'price', format: (v) => <span className="font-bold text-lg">{formatCurrency(v)}</span> },
                  { label: 'Category', key: 'category' },
                  { label: 'Fuel Type', key: 'fuel', format: (v) => v || 'N/A' },
                  { label: 'Transmission', key: 'transmission', format: (v) => v || 'N/A' },
                  { label: 'Mileage', key: 'mileage', format: (v) => v ? `${v.toLocaleString()} mi` : 'N/A' },
                  { label: 'Color', key: 'color', format: (v) => v || 'N/A' },
                  { label: 'Availability', key: 'quantity', format: (v) => (
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      v > 0 ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                    )}>
                      {v > 0 ? `${v} In Stock` : 'Sold Out'}
                    </span>
                  )}
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors">
                    <td className="p-6 font-bold text-sm text-text-muted border-r border-border bg-surface/20">
                      {row.label}
                    </td>
                    {selectedVehicles.map(v => (
                      <td key={v._id} className="p-6 text-center border-r border-border last:border-0 text-text-main font-medium">
                        {row.format ? row.format(v[row.key]) : v[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-3xl p-16 text-center border border-border border-dashed">
          <Scale size={48} className="mx-auto text-border mb-4" />
          <h3 className="text-xl font-bold text-text-main mb-2">Ready to Compare?</h3>
          <p className="text-text-muted max-w-md mx-auto">
            Select up to 4 vehicles from the inventory above to compare their features and pricing side-by-side.
          </p>
        </div>
      )}
    </div>
  );
};
