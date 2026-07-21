const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  purchaseDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Pending', 'Cancelled'], default: 'Completed' }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
