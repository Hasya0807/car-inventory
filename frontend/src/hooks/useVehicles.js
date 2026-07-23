import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicle.service';
import { useSocket } from '../context/SocketContext';

export const useVehicles = (initialFilters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  
  const [filters, setFilters] = useState(() => {
    try {
      const saved = sessionStorage.getItem('inventoryFilters');
      return saved ? JSON.parse(saved) : initialFilters;
    } catch {
      return initialFilters;
    }
  });
  
  const [page, setPage] = useState(() => {
    try {
      const savedPage = sessionStorage.getItem('inventoryPage');
      return savedPage ? Number(savedPage) : 1;
    } catch {
      return 1;
    }
  });
  
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    sessionStorage.setItem('inventoryFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem('inventoryPage', page.toString());
  }, [page]);

  const socket = useSocket();

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { ...filters, page, limit };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await vehicleService.getVehicles(params);
      setVehicles(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (socket) {
      socket.on('INVENTORY_UPDATED', fetchVehicles);
      return () => {
        socket.off('INVENTORY_UPDATED', fetchVehicles);
      };
    }
  }, [socket, fetchVehicles]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    vehicles,
    loading,
    error,
    meta,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    page,
    setPage,
    limit,
    setLimit,
    refresh: fetchVehicles
  };
};
