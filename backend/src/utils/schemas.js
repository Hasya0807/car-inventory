const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  role: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional()
});

const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.enum(['Sedan','SUV','Truck','Coupe','Hatchback','Van']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive').optional(),
  year: z.coerce.number().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.coerce.number().optional(),
  color: z.string().optional(),
  images: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional()
});

const updateVehicleSchema = createVehicleSchema.partial();

const purchaseSchema = z.object({
  quantity: z.number().min(1, 'Purchase quantity must be at least 1').optional()
});

const restockSchema = z.object({
  quantity: z.number().min(1, 'Restock quantity must be at least 1')
});

module.exports = {
  registerSchema,
  loginSchema,
  createVehicleSchema,
  updateVehicleSchema,
  purchaseSchema,
  restockSchema
};
