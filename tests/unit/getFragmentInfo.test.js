// tests/unit/getInfo.test.js
const request = require('supertest');
const app = require('../../src/app');


// Mock the Fragment.byId() method
jest.mock('../../src/model/fragment', () => {
  const originalModule = jest.requireActual('../../src/model/fragment');

  return {
    Fragment: {
      ...originalModule.Fragment,
      byId: jest.fn(),
    },
  };
});

describe('GET /v1/fragments/:id/info', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('unauthenticated requests are denied', () =>
    request(app)
      .get('/v1/fragments/someid/info')
      .expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/someid/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  
});