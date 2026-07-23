import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleGrid } from '../components/vehicles/VehicleGrid';
import { Modal } from '../components/ui/Modal';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Pagination } from '../components/vehicles/Pagination';
import vehicleService from '../services/vehicle.service';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Box } from 'lucide-react';

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
    <div className="w-full bg-surface min-h-[80vh]">
      {/* Admin Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark border-4 border-surface shadow-sm shrink-0">
               <Box size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-1">Admin Control Panel</h1>
              <p className="text-text-muted text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Dealership Operations
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 md:mt-0">
            <form onSubmit={handleSearchSubmit} className="flex-1 sm:flex-none relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-surface border border-border rounded-xl pl-10 pr-3 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </form>
            
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-primary text-gray-900 px-6 py-3 text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={18} /> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        <VehicleGrid 
          vehicles={vehicles} 
          loading={loading} 
          isAdmin={true}
          onEdit={openEditModal}
        />
        
        <div className="mt-8">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
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
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <button 
              onClick={() => { setIsFormOpen(false); openRestockModal(editingVehicle._id); }}
              className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
            >
              + Restock Inventory
            </button>
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
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
              <p className="text-text-main mb-1">
                <span className="font-bold">{restockVehicle.make} {restockVehicle.model}</span>
              </p>
              <p className="text-sm text-text-muted mb-4">
                Current stock: <span className="font-mono text-text-main">{restockVehicle.quantity}</span>
              </p>
              
              <label className="block text-sm text-text-muted mb-1">Quantity to Add</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  min="1"
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                  className="w-32 bg-surface border border-border rounded-xl px-3 py-2 text-text-main font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
                <span className="text-sm text-text-muted">units</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button 
                type="button"
                onClick={() => setIsRestockOpen(false)}
                className="px-6 py-2.5 text-sm text-text-main bg-surface border border-border hover:bg-card rounded-xl font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 text-sm text-gray-900 bg-primary hover:bg-primary-dark rounded-xl font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
