const request = require('supertest');
const express = require('express');
const { validate } = require('../../src/middleware/validateRequest');
const { z } = require('zod');

const app = express();
app.use(express.json());

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  age: z.number().min(18, { message: 'Must be at least 18' })
});

app.post('/test', validate(schema), (req, res) => {
  res.json({ success: true });
});

describe('Validation Middleware', () => {
  it('should pass validation', async () => {
    const res = await request(app).post('/test').send({ name: 'Test', age: 25 });
    expect(res.statusCode).toBe(200);
  });

  it('should fail validation with 400', async () => {
    const res = await request(app).post('/test').send({ name: '', age: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Name is required');
    expect(res.body.message).toContain('Must be at least 18');
  });
});
