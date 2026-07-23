const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, enum: ['Sedan','SUV','Truck','Coupe','Hatchback','Van'], required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  year: Number,
  fuel: String,
  transmission: String,
  mileage: Number,
  color: String,
  images: [String],
  imageUrl: String,
  description: String,
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

vehicleSchema.index({ make: 'text', model: 'text' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
