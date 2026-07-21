require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

const vehicles = [
  { make: 'Honda', model: 'Civic Type R', year: 2024, price: 4400000, category: 'Hatchback', quantity: 3, fuel: 'Petrol', transmission: 'Manual', color: 'Championship White', mileage: 12, imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop' },
  { make: 'Porsche', model: '911 Carrera', year: 2024, price: 17500000, category: 'Coupe', quantity: 1, fuel: 'Petrol', transmission: 'Automatic', color: 'Guards Red', mileage: 9, imageUrl: 'https://images.unsplash.com/photo-1503376713220-302377b3b3cb?q=80&w=800&auto=format&fit=crop' },
  { make: 'Toyota', model: 'Tacoma TRD Pro', year: 2023, price: 4800000, category: 'Truck', quantity: 5, fuel: 'Petrol', transmission: 'Automatic', color: 'Lunar Rock', mileage: 10, imageUrl: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=800&auto=format&fit=crop' },
  { make: 'BMW', model: 'M3 Competition', year: 2024, price: 14700000, category: 'Sedan', quantity: 2, fuel: 'Petrol', transmission: 'Automatic', color: 'Isle of Man Green', mileage: 10, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop' },
  { make: 'Audi', model: 'RS6 Avant', year: 2024, price: 16500000, category: 'Sedan', quantity: 0, fuel: 'Petrol', transmission: 'Automatic', color: 'Nardo Gray', mileage: 8, imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop' },
  { make: 'Mercedes-Benz', model: 'G-Class G550', year: 2023, price: 25500000, category: 'SUV', quantity: 2, fuel: 'Petrol', transmission: 'Automatic', color: 'Obsidian Black', mileage: 7, imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop' },
  { make: 'Ford', model: 'Mustang Dark Horse', year: 2024, price: 7400000, category: 'Coupe', quantity: 4, fuel: 'Petrol', transmission: 'Manual', color: 'Blue Ember', mileage: 9, imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop' },
  { make: 'Chevrolet', model: 'Corvette Z06', year: 2024, price: 22000000, category: 'Coupe', quantity: 1, fuel: 'Petrol', transmission: 'Automatic', color: 'Torch Red', mileage: 8, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop' },
  { make: 'Rivian', model: 'R1S', year: 2023, price: 9500000, category: 'SUV', quantity: 3, fuel: 'Electric', transmission: 'Automatic', color: 'LA Silver', mileage: 0, imageUrl: 'https://images.unsplash.com/photo-1662489679659-0010991c0e3a?q=80&w=800&auto=format&fit=crop' },
  { make: 'Tesla', model: 'Model S Plaid', year: 2024, price: 11000000, category: 'Sedan', quantity: 6, fuel: 'Electric', transmission: 'Automatic', color: 'Deep Blue Metallic', mileage: 0, imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop' },
  { make: 'Subaru', model: 'Outback Wilderness', year: 2024, price: 3900000, category: 'SUV', quantity: 8, fuel: 'Petrol', transmission: 'Automatic', color: 'Geyser Blue', mileage: 13, imageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=80&w=800&auto=format&fit=crop' },
  { make: 'Honda', model: 'Odyssey Touring', year: 2023, price: 4200000, category: 'Van', quantity: 4, fuel: 'Petrol', transmission: 'Automatic', color: 'Platinum White', mileage: 11, imageUrl: 'https://images.unsplash.com/photo-1517409230536-f084b6470659?q=80&w=800&auto=format&fit=crop' }
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
