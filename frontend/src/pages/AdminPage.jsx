import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { Navbar } from '../components/layout/Navbar';
import { Modal } from '../components/ui/Modal';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Pagination } from '../components/vehicles/Pagination';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';
import { Plus, Search } from 'lucide-react';

export const AdminPage = () => {
  const { vehicles, loading, meta, filters, updateFilter, setPage, refresh } = useVehicles();
  const { addToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Restock modal state
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockVehicle, setRestockVehicle] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchTerm);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    const vehicle = vehicles.find(v => v._id === id);
    if (vehicle) {
      setEditingVehicle(vehicle);
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle._id, data);
        addToast('Vehicle updated successfully', 'success');
      } else {
        await vehicleService.createVehicle(data);
        addToast('Vehicle added successfully', 'success');
      }
      setIsFormOpen(false);
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save vehicle', 'error');
    }
  };

  const handleDelete = async () => {
    if (!editingVehicle) return;
    if (window.confirm(`Are you sure you want to delete this ${editingVehicle.make} ${editingVehicle.model}?`)) {
      try {
        await vehicleService.deleteVehicle(editingVehicle._id);
        addToast('Vehicle deleted successfully', 'success');
        setIsFormOpen(false);
        refresh();
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete vehicle', 'error');
      }
    }
  };

  const openRestockModal = (id) => {
    const vehicle = vehicles.find(v => v._id === id);
    if (vehicle) {
      setRestockVehicle(vehicle);
      setRestockQuantity(1);
      setIsRestockOpen(true);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    try {
      await vehicleService.restockVehicle(restockVehicle._id, restockQuantity);
      addToast(`Added ${restockQuantity} units to stock`, 'success');
      setIsRestockOpen(false);
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restock', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-asphalt flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-display font-bold text-chrome">Admin Dashboard</h1>
            <p className="text-sm text-graphite mt-1">Manage inventory, stock levels, and vehicle listings.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <form onSubmit={handleSearchSubmit} className="flex-1 sm:flex-none relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-graphite" />
              </div>
              <input
                type="text"
                placeholder="Search by VIN or make..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-charcoal border border-gray-700 rounded pl-10 pr-3 py-2 text-sm text-chrome focus:outline-none focus:border-ignition focus:ring-1 focus:ring-ignition"
              />
            </form>
            
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-chrome text-asphalt px-4 py-2 text-sm font-bold rounded hover:bg-white transition-colors"
            >
              <Plus size={16} /> Add Vehicle
            </button>
          </div>
        </div>

        <VehicleGrid 
          vehicles={vehicles} 
          loading={loading} 
          isAdmin={true}
          onEdit={openEditModal}
        />
        
        <Pagination meta={meta} onPageChange={setPage} />
      </main>

      {/* Vehicle Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <VehicleForm 
          initialData={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
        {editingVehicle && (
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <button 
              onClick={() => { setIsFormOpen(false); openRestockModal(editingVehicle._id); }}
              className="text-status-green hover:text-green-400 text-sm font-medium transition-colors"
            >
              + Restock Inventory
            </button>
            <button 
              onClick={handleDelete}
              className="text-ignition hover:text-red-400 text-sm font-medium transition-colors"
            >
              Delete Vehicle
            </button>
          </div>
        )}
      </Modal>

      {/* Restock Modal */}
      <Modal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        title="Restock Vehicle"
      >
        {restockVehicle && (
          <form onSubmit={handleRestockSubmit}>
            <div className="mb-6">
              <p className="text-chrome mb-1">
                <span className="font-bold">{restockVehicle.make} {restockVehicle.model}</span>
              </p>
              <p className="text-sm text-graphite mb-4">
                Current stock: <span className="font-mono text-chrome">{restockVehicle.quantity}</span>
              </p>
              
              <label className="block text-sm text-graphite mb-1">Quantity to Add</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  min="1"
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                  className="w-32 bg-asphalt border border-gray-700 rounded px-3 py-2 text-chrome font-mono focus:outline-none focus:border-status-green focus:ring-1 focus:ring-status-green"
                />
                <span className="text-sm text-graphite">units</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button 
                type="button"
                onClick={() => setIsRestockOpen(false)}
                className="px-4 py-2 text-sm text-chrome bg-gray-800 hover:bg-gray-700 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm text-asphalt bg-status-green hover:bg-green-400 rounded font-medium transition-colors"
              >
                Confirm Restock
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
