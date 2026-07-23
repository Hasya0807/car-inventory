import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        success: true,
        data: []
      }
    })
  }
}));

describe('AdminOrdersPage', () => {
  it('renders the admin orders layout', async () => {
    render(
      <BrowserRouter>
        <AdminOrdersPage />
      </BrowserRouter>
    );

    const title = screen.getByText('Orders Placed');
    expect(title).toBeInTheDocument();
  });
});
