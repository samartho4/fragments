// tests/unit/getFragmentInfo.test.js
const request = require('supertest');
const app = require('../../src/app');


describe('GET /v1/fragments/:id/info', () => {
  // Set memory implementation for testing
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .get('/v1/fragments/some-id/info');
    expect(res.statusCode).toBe(401);
  });
  
  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .get('/v1/fragments/some-id/info')
      .auth('invalid@email.com', 'incorrect_password');
    expect(res.statusCode).toBe(401);
  });
  
  test('returns 404 when fragment does not exist', async () => {
    const res = await request(app)
      .get('/v1/fragments/non-existent-id/info')
      .auth('user1@email.com', 'password1');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
  });
});