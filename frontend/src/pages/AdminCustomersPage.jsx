import React, { useEffect, useState } from 'react';
import userService from '../services/user.service';
import { useToast } from '../context/ToastContext';
import { Users, Mail, Phone, ShoppingBag, Heart } from 'lucide-react';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await userService.getUsers();
        setCustomers(response.data);
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to fetch customers', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [addToast]);

  return (
    <div className="w-full bg-surface min-h-[80vh]">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm shrink-0">
               <Users size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-1">Customer Directory</h1>
              <p className="text-text-muted text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> User Management & CRM
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-xl font-medium">No customers found.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-text-muted text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                  <th className="p-4 font-semibold text-center">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((user) => (
                  <tr key={user._id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 text-sm flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full border border-border overflow-hidden shrink-0">
                        <span className="font-bold text-sm text-text-main">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-text-main whitespace-nowrap">{user.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2 text-text-muted mb-1">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-text-muted">
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-main">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center" title="Total Purchases">
                          <ShoppingBag size={18} className="text-primary-dark mb-1" />
                          <span className="text-xs font-bold text-text-main">{user.purchaseCount || 0}</span>
                        </div>
                        <div className="flex flex-col items-center" title="Wishlisted Items">
                          <Heart size={18} className="text-red-500 mb-1" />
                          <span className="text-xs font-bold text-text-main">{user.wishlistCount || 0}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
