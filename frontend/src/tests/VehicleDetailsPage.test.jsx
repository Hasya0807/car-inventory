import React from 'react';
import { render, screen } from '@testing-library/react';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('/similar')) {
        return Promise.resolve({ data: { success: true, data: [] } });
      }
      return Promise.resolve({
        data: {
          success: true,
          data: {
            _id: 'test-123',
            make: 'TestMake',
            model: 'TestModel',
            year: 2024,
            price: 50000,
            imageUrl: 'http://test.com/img.jpg',
            category: 'Sedan',
            isFeatured: false,
            quantity: 5
          }
        }
      });
    })
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-123' })
  };
});

describe('VehicleDetailsPage', () => {
  it('renders the similar vehicles section', async () => {
    render(
      <BrowserRouter>
        <VehicleDetailsPage />
      </BrowserRouter>
    );

    const heading = await screen.findByText('You Might Also Like');
    expect(heading).toBeInTheDocument();
  });
});
