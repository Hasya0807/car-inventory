import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { ToastProvider } from '../context/ToastContext';

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('VehicleCard', () => {
  const mockVehicle = {
    _id: '123',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 25000,
    category: 'sedan',
    quantity: 5
  };

  it('renders vehicle details correctly', () => {
    renderWithProviders(<VehicleCard vehicle={mockVehicle} onPurchase={() => {}} isAdmin={false} />);
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('₹25,000')).toBeInTheDocument();
  });

  it('allows purchase when stock is available', () => {
    const handlePurchase = vi.fn();
    renderWithProviders(<VehicleCard vehicle={mockVehicle} onPurchase={handlePurchase} isAdmin={false} />);
    
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).not.toBeDisabled();
    
    fireEvent.click(purchaseButton);
    expect(handlePurchase).toHaveBeenCalledWith('123');
  });

  it('disables purchase button when out of stock', () => {
    const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
    renderWithProviders(<VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} isAdmin={false} />);
    
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).toBeDisabled();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });
});
