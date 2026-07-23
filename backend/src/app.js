const express = require('express');

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const testDriveRoutes = require('./routes/testDriveRoutes');
const orderRoutes = require('./routes/orderRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', interactionRoutes); // /api/wishlist and /api/purchases
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use(errorHandler);

module.exports = app;
