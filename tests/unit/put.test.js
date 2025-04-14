// tests/unit/put.test.js
const request = require('supertest');
const app = require('../../src/app');


describe('PUT /v1/fragments/:id', () => {
  // Set memory implementation for testing
  
  
  test('returns 404 when fragment does not exist', async () => {
    const res = await request(app)
      .put('/v1/fragments/non-existent-id')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('New content');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
  });
  
});