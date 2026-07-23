const mongoose = require('mongoose');

const testDriveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  slot: { type: String, required: true }, // Format HH:MM (e.g., '09:00', '09:30')
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index to absolutely prevent double bookings of the same car on the same day and slot
testDriveSchema.index({ vehicleId: 1, date: 1, slot: 1 }, { unique: true });

const TestDrive = mongoose.model('TestDrive', testDriveSchema);

module.exports = TestDrive;
