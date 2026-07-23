import React, { useEffect, useState } from 'react';
import orderService from '../services/order.service';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Calendar } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders();
        setOrders(response.data);
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to fetch orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [addToast]);

  // Group orders month-wise
  const groupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.purchaseDate);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(order);
    return acc;
  }, {});

  return (
    <div className="w-full bg-surface min-h-[80vh]">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm shrink-0">
               <Calendar size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-1">Orders Placed</h1>
              <p className="text-text-muted text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Track Customer Purchases
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
        ) : Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-xl font-medium">No orders found.</p>
          </div>
        ) : (
          Object.keys(groupedOrders).map((monthYear) => (
            <div key={monthYear} className="mb-12">
              <h2 className="text-2xl font-bold font-display text-text-main mb-6 border-b border-border pb-2">
                {monthYear}
              </h2>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border text-text-muted text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Vehicle</th>
                      <th className="p-4 font-semibold">Quantity</th>
                      <th className="p-4 font-semibold">Total Price</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {groupedOrders[monthYear].map((order) => (
                      <tr key={order._id} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 text-sm text-text-main whitespace-nowrap">
                          {new Date(order.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm">
                          <p className="font-bold text-text-main">{order.userId?.name || 'Unknown'}</p>
                          <p className="text-text-muted">{order.userId?.email || 'No email'}</p>
                        </td>
                        <td className="p-4 text-sm flex items-center gap-3">
                          {order.vehicleId?.imageUrl && (
                            <img 
                              src={order.vehicleId.imageUrl} 
                              alt="Car Thumbnail" 
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <div>
                            <p className="font-bold text-text-main whitespace-nowrap">
                              {order.vehicleId?.make} {order.vehicleId?.model}
                            </p>
                            <p className="text-text-muted">{order.vehicleId?.year}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-text-main font-medium">
                          {order.quantity}
                        </td>
                        <td className="p-4 text-sm text-text-main font-bold whitespace-nowrap">
                          {formatCurrency(order.price * order.quantity)}
                        </td>
                        <td className="p-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
