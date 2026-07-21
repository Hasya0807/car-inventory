const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if system action
  action: { type: String, required: true }, // e.g. 'Vehicle Added', 'User Deleted'
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
