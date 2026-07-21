import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-white">Loading Analytics...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const summaryCards = [
    { label: 'Total Vehicles', value: stats.totalVehicles },
    { label: 'Vehicles In Stock', value: stats.vehiclesInStock },
    { label: 'Out of Stock', value: stats.outOfStock },
    { label: 'Total Purchases', value: stats.totalPurchases },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}` },
    { label: 'Today\'s Purchases', value: stats.todaysPurchases },
  ];

  // Dummy data for charts since we didn't aggregate it on backend to keep it simple, but we can visualize what we have.
  const pieData = [
    { name: 'In Stock', value: stats.vehiclesInStock, color: '#4CAF50' },
    { name: 'Out of Stock', value: stats.outOfStock, color: '#F44336' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-center items-center text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{card.label}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px]">
          <h3 className="text-xl font-semibold text-white mb-6">Inventory Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Placeholder for bar chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px]">
          <h3 className="text-xl font-semibold text-white mb-6">Revenue overview</h3>
          <div className="flex h-full items-center justify-center text-gray-500 italic">
            More data needed for detailed chart
          </div>
        </div>
      </div>
    </div>
  );
};
