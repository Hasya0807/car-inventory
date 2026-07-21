const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.enum(['Sedan','SUV','Truck','Coupe','Hatchback','Van']),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().min(0, 'Quantity must be positive').optional(),
  year: z.number().optional(),
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
