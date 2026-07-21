import React, { useState, useEffect } from 'react';
import api from '../services/api';

export const ComparePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Compare Vehicles</h1>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-xl mb-4">Select vehicles to compare (max 4)</h2>
        <div className="flex flex-wrap gap-3">
          {vehicles.map(v => (
            <button 
              key={v._id} 
              onClick={() => toggleSelect(v._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedIds.includes(v._id) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {v.make} {v.model}
            </button>
          ))}
        </div>
      </div>

      {selectedVehicles.length > 0 ? (
        <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 border-r border-gray-700">Feature</th>
                {selectedVehicles.map(v => (
                  <th key={v._id} className="p-4 border-r border-gray-700 last:border-0 font-bold text-lg text-center">
                    {v.make} <br/> <span className="text-sm font-normal text-gray-400">{v.model}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Price', key: 'price', format: (v) => `₹${v.toLocaleString()}` },
                { label: 'Category', key: 'category' },
                { label: 'Fuel Type', key: 'fuel', format: (v) => v || 'N/A' },
                { label: 'Transmission', key: 'transmission', format: (v) => v || 'N/A' },
                { label: 'Mileage', key: 'mileage', format: (v) => v ? `${v} kmpl` : 'N/A' },
                { label: 'Color', key: 'color', format: (v) => v || 'N/A' },
                { label: 'Stock', key: 'quantity', format: (v) => v > 0 ? `${v} Available` : 'Out of Stock' }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700 last:border-0">
                  <td className="p-4 font-semibold text-gray-300 border-r border-gray-700 bg-gray-900/50">{row.label}</td>
                  {selectedVehicles.map(v => (
                    <td key={v._id} className="p-4 text-center border-r border-gray-700 last:border-0">
                      {row.format ? row.format(v[row.key]) : v[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          Select at least one vehicle to start comparing.
        </div>
      )}
    </div>
  );
};
