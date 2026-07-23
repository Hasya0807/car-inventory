const mongoose = require('mongoose');
require('dotenv').config();
const Vehicle = require('./src/models/Vehicle');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  const cybertruck = {
    make: 'Tesla',
    model: 'Cybertruck (Cipher)',
    year: 2024,
    price: 79990,
    category: 'Truck',
    fuel: 'Electric',
    transmission: 'Automatic',
    quantity: 3,
    description: "The Tesla Cybertruck (often spelled 'cipher') is a polarizing, futuristic electric pickup truck featuring an unpainted, dent-resistant stainless steel exoskeleton. It boasts sports-car acceleration (0-60 mph in 2.6 seconds for the Cyberbeast), an EPA-estimated range of 250–340 miles, and heavy-duty towing capacity (11,000 lbs).",
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    createdBy: null
  };

  try {
    await Vehicle.create(cybertruck);
    console.log('Tesla Cybertruck added successfully!');
  } catch (err) {
    console.error('Error adding vehicle:', err.message);
  }

  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
