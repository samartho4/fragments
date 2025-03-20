// tests/unit/auth-index.test.js
const path = require('path');
const originalEnv = process.env;

describe('Auth index module', () => {
  // Save the original environment variables
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });
  
  // Restore original environment after tests
  afterEach(() => {
    process.env = originalEnv;
  });

  
  test('uses Basic Auth when HTPASSWD_FILE is set and not in production', () => {
    // Setup Basic Auth environment variables
    process.env.HTPASSWD_FILE = path.join(__dirname, '../.htpasswd');
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    process.env.NODE_ENV = 'development';
    
    const auth = require('../../src/auth');
    expect(auth).toBeDefined();
    expect(auth.authenticate).toBeDefined();
    expect(auth.strategy).toBeDefined();
  });

  test('throws when no auth configuration is found', () => {
    // Clear all auth-related environment variables
    delete process.env.HTPASSWD_FILE;
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    
    expect(() => require('../../src/auth')).toThrow(/no authorization configuration found/);
  });

  test('throws when both auth methods are configured', () => {
    // Set both auth configurations
    process.env.HTPASSWD_FILE = path.join(__dirname, '../.htpasswd');
    process.env.AWS_COGNITO_POOL_ID = 'test-pool-id';
    process.env.AWS_COGNITO_CLIENT_ID = 'test-client-id';
    
    expect(() => require('../../src/auth')).toThrow(/both AWS Cognito and HTTP Basic Auth/);
  });

  
});