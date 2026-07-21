require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

const vehicles = [
  { make: 'Honda', model: 'Civic Type R', year: 2024, price: 44795, category: 'Hatchback', quantity: 3 },
  { make: 'Porsche', model: '911 Carrera', year: 2024, price: 114400, category: 'Coupe', quantity: 1 },
  { make: 'Toyota', model: 'Tacoma TRD Pro', year: 2023, price: 48035, category: 'Truck', quantity: 5 },
  { make: 'BMW', model: 'M3 Competition', year: 2024, price: 82200, category: 'Sedan', quantity: 2 },
  { make: 'Audi', model: 'RS6 Avant', year: 2024, price: 125800, category: 'Sedan', quantity: 0 },
  { make: 'Mercedes-Benz', model: 'G-Class G550', year: 2023, price: 139900, category: 'SUV', quantity: 2 },
  { make: 'Ford', model: 'Mustang Dark Horse', year: 2024, price: 59270, category: 'Coupe', quantity: 4 },
  { make: 'Chevrolet', model: 'Corvette Z06', year: 2024, price: 109300, category: 'Coupe', quantity: 1 },
  { make: 'Rivian', model: 'R1S', year: 2023, price: 78000, category: 'SUV', quantity: 3 },
  { make: 'Tesla', model: 'Model S Plaid', year: 2024, price: 89990, category: 'Sedan', quantity: 6 },
  { make: 'Subaru', model: 'Outback Wilderness', year: 2024, price: 39960, category: 'SUV', quantity: 8 },
  { make: 'Honda', model: 'Odyssey Touring', year: 2023, price: 44600, category: 'Van', quantity: 4 }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-dealership');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Clear existing data
    await Vehicle.deleteMany({});
    
    // Insert dummy vehicles
    await Vehicle.insertMany(vehicles);
    console.log('Vehicles seeded successfully!');

    // Check if admin user exists, if not create one
    const adminExists = await User.findOne({ email: 'admin@dealership.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@dealership.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created (admin@dealership.com / password123)');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
