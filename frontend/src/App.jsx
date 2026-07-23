import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute, AdminRoute } from './components/layout/RouteGuards';

import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { AdminPage } from './pages/AdminPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ComparePage } from './pages/ComparePage';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';

import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<AppLayout />}>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
        
        <Route element={<ProtectedRoute />}>
          {/* Customer Routes */}
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          
          <Route element={<AdminRoute />}>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
