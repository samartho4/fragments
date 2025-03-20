// tests/unit/auth-middleware.test.js
const request = require('supertest');
const express = require('express');
const passport = require('passport');
const authMiddleware = require('../../src/auth/auth-middleware');

describe('Auth Middleware', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    
    // Mock passport.authenticate
    passport.authenticate = jest.fn((strategy, options, callback) => {
      return (req, res, next) => {
        if (req.headers['x-test-error']) {
          callback(new Error('Authentication error'));
        } else if (req.headers['x-test-unauthorized']) {
          callback(null, null);
        } else {
          callback(null, 'user@example.com');
        }
      };
    });
    
    // Setup a test route with our middleware
    app.use('/protected', authMiddleware('test-strategy'), (req, res) => {
      res.status(200).json({ user: req.user });
    });
  });

  test('successfully authenticates and attaches user to request', async () => {
    const res = await request(app).get('/protected');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  test('returns 401 for unauthorized users', async () => {
    const res = await request(app)
      .get('/protected')
      .set('X-Test-Unauthorized', 'true');
    
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  
});