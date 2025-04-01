// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 Handler', () => {
  test('should return a 404 error for non-existent routes', async () => {
    const res = await request(app).get('/nonexistent-route');
    
    // Assert the status code is 404
    expect(res.statusCode).toBe(404);

    // Assert the response body matches the expected structure
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
