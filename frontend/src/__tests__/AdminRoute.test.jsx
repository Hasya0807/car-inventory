import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminRoute } from '../components/layout/RouteGuards';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '../context/AuthContext';

describe('AdminRoute', () => {
  it('renders child routes when user is admin', () => {
    useAuth.mockReturnValue({ isAdmin: true });
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to dashboard when user is not admin', () => {
    useAuth.mockReturnValue({ isAdmin: false });
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
