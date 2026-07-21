const request = require('supertest');
const express = require('express');
const { errorHandler } = require('../../src/middleware/errorMiddleware');
const ApiError = require('../../src/utils/ApiError');

const app = express();

app.get('/api-error', (req, res, next) => {
  next(new ApiError(404, 'Not found custom'));
});

app.get('/generic-error', (req, res, next) => {
  next(new Error('Generic Error'));
});

app.use(errorHandler);

describe('Error Middleware', () => {
  it('should handle ApiError and return correct status', async () => {
    const res = await request(app).get('/api-error');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Not found custom');
  });

  it('should handle generic error and return 500', async () => {
    const res = await request(app).get('/generic-error');
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Generic Error');
  });
});
