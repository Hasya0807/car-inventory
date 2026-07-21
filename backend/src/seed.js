require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

const vehicles = [
  { make: 'Honda', model: 'Civic Type R', year: 2024, price: 44795, category: 'Hatchback', quantity: 3, fuel: 'Petrol', transmission: 'Manual', imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop' },
  { make: 'Porsche', model: '911 Carrera', year: 2024, price: 114400, category: 'Coupe', quantity: 1, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1503376713220-302377b3b3cb?q=80&w=800&auto=format&fit=crop' },
  { make: 'Toyota', model: 'Tacoma TRD Pro', year: 2023, price: 48035, category: 'Truck', quantity: 5, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=800&auto=format&fit=crop' },
  { make: 'BMW', model: 'M3 Competition', year: 2024, price: 82200, category: 'Sedan', quantity: 2, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop' },
  { make: 'Audi', model: 'RS6 Avant', year: 2024, price: 125800, category: 'Sedan', quantity: 0, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop' },
  { make: 'Mercedes-Benz', model: 'G-Class G550', year: 2023, price: 139900, category: 'SUV', quantity: 2, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop' },
  { make: 'Ford', model: 'Mustang Dark Horse', year: 2024, price: 59270, category: 'Coupe', quantity: 4, fuel: 'Petrol', transmission: 'Manual', imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop' },
  { make: 'Chevrolet', model: 'Corvette Z06', year: 2024, price: 109300, category: 'Coupe', quantity: 1, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop' },
  { make: 'Rivian', model: 'R1S', year: 2023, price: 78000, category: 'SUV', quantity: 3, fuel: 'Electric', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1662489679659-0010991c0e3a?q=80&w=800&auto=format&fit=crop' },
  { make: 'Tesla', model: 'Model S Plaid', year: 2024, price: 89990, category: 'Sedan', quantity: 6, fuel: 'Electric', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop' },
  { make: 'Subaru', model: 'Outback Wilderness', year: 2024, price: 39960, category: 'SUV', quantity: 8, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=80&w=800&auto=format&fit=crop' },
  { make: 'Honda', model: 'Odyssey Touring', year: 2023, price: 44600, category: 'Van', quantity: 4, fuel: 'Petrol', transmission: 'Automatic', imageUrl: 'https://images.unsplash.com/photo-1517409230536-f084b6470659?q=80&w=800&auto=format&fit=crop' }
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
