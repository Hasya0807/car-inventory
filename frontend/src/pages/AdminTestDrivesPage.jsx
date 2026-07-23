import React, { useEffect, useState } from 'react';
import testDriveService from '../services/testDrive.service';
import { useToast } from '../context/ToastContext';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export const AdminTestDrivesPage = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTestDrives = async () => {
    try {
      const response = await testDriveService.getAllTestDrives();
      setTestDrives(response.data);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch test drives', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDrives();
  }, [addToast]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await testDriveService.updateTestDriveStatus(id, status);
      addToast(`Test drive marked as ${status}`, 'success');
      fetchTestDrives();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="w-full bg-surface min-h-[80vh]">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm shrink-0">
               <Calendar size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-1">Test Drive Management</h1>
              <p className="text-text-muted text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Manage Appointments
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
        ) : testDrives.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-xl font-medium">No test drives scheduled.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-text-muted text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {testDrives.map((td) => (
                  <tr key={td._id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 text-sm text-text-main whitespace-nowrap font-medium">
                      {new Date(td.date).toLocaleDateString()} at {td.slot}
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-bold text-text-main">{td.userId?.name || 'Unknown'}</p>
                      <p className="text-text-muted">{td.userId?.email || 'No email'}</p>
                    </td>
                    <td className="p-4 text-sm text-text-muted">
                      {td.contactNumber}
                    </td>
                    <td className="p-4 text-sm flex items-center gap-3">
                      {td.vehicleId?.imageUrl && (
                        <img 
                          src={td.vehicleId.imageUrl} 
                          alt="Car Thumbnail" 
                          className="w-12 h-12 object-cover rounded-lg shadow-sm"
                        />
                      )}
                      <div>
                        <p className="font-bold text-text-main whitespace-nowrap">
                          {td.vehicleId?.make} {td.vehicleId?.model}
                        </p>
                        <p className="text-text-muted">{td.vehicleId?.year}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        td.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        td.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {td.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {td.status === 'Scheduled' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(td._id, 'Completed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(td._id, 'Cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Test Drive"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
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
