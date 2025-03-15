const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id/info', () => {
  // Set up a test fragment
  let testFragment;

  // Before each test, create a test fragment we can use
  beforeEach(async () => {
    testFragment = new Fragment({ 
      ownerId: 'user1@email.com', 
      type: 'text/plain',
      size: 0
    });
    
    // Save the fragment
    await testFragment.save();
    
    // Add some data to the fragment
    await testFragment.setData(Buffer.from('This is test data'));
  });

  

  test('unauthenticated requests are denied', () =>
    request(app)
      .get(`/v1/fragments/${testFragment.id}/info`)
      .expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get(`/v1/fragments/${testFragment.id}/info`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('fragment with the given id is not existed', async () => {
    const res = await request(app)
      .get(`/v1/fragments/non-existent-id/info`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
  });

  
});