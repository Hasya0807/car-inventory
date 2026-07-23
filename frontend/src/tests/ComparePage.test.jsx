import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparePage } from '../pages/ComparePage';
import { BrowserRouter } from 'react-router-dom';

// Mock the API response
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        success: true,
        data: Array.from({ length: 20 }, (_, i) => ({
          _id: `vehicle-${i}`,
          make: 'Test',
          model: `Car ${i}`,
          price: 20000
        }))
      }
    })
  }
}));

describe('ComparePage', () => {
  it('renders correctly and fetches vehicles', async () => {
    render(
      <BrowserRouter>
        <ComparePage />
      </BrowserRouter>
    );

    // Initial loading state
    expect(screen.getByText('Loading vehicles...')).toBeInTheDocument();

    // After loading, it should only show 15 items initially due to our pagination fix
    const moreCarsButton = await screen.findByText(/\+ 5 More Cars/i);
    expect(moreCarsButton).toBeInTheDocument();
  });
});
