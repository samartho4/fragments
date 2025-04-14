// tests/unit/delete.test.js
const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

// Mock Fragment.byId and delete methods
jest.mock('../../src/model/fragment', () => {
  const originalModule = jest.requireActual('../../src/model/fragment');
  return {
    Fragment: {
      ...originalModule.Fragment,
      byId: jest.fn(),
      delete: jest.fn()
    }
  };
});

describe('DELETE /v1/fragments/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .delete('/v1/fragments/some-id');
    expect(res.statusCode).toBe(401);
  });
  
  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .delete('/v1/fragments/some-id')
      .auth('invalid@email.com', 'wrong-password');
    expect(res.statusCode).toBe(401);
  });
  
  test('returns 404 when fragment does not exist', async () => {
    // Mock Fragment.byId to throw "Fragment not found" error
    Fragment.byId.mockRejectedValueOnce(new Error('Fragment not found'));
    
    const res = await request(app)
      .delete('/v1/fragments/non-existent-id')
      .auth('user1@email.com', 'password1');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
  });
});