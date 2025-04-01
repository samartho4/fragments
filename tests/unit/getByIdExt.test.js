// tests/unit/getByIdExt.test.js
const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id.:ext', () => {
  let markdownFragment;
  let plainTextFragment;
  let jsonFragment;

  // Setup test fragments
  beforeEach(async () => {
    // Create markdown fragment
    markdownFragment = new Fragment({ 
      ownerId: 'user1@email.com', 
      type: 'text/markdown',
      size: 0
    });
    await markdownFragment.save();
    await markdownFragment.setData(Buffer.from('# Heading\n\nParagraph text'));
    
    // Create plain text fragment
    plainTextFragment = new Fragment({ 
      ownerId: 'user1@email.com', 
      type: 'text/plain',
      size: 0
    });
    await plainTextFragment.save();
    await plainTextFragment.setData(Buffer.from('Plain text content'));
    
    // Create JSON fragment
    jsonFragment = new Fragment({ 
      ownerId: 'user1@email.com', 
      type: 'application/json',
      size: 0
    });
    await jsonFragment.save();
    await jsonFragment.setData(Buffer.from('{"key":"value"}'));
  });

  test('unauthenticated requests are denied', () =>
    request(app)
      .get(`/v1/fragments/${markdownFragment.id}.html`)
      .expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get(`/v1/fragments/${markdownFragment.id}.html`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('returns 404 if fragment does not exist', async () => {
    const res = await request(app)
      .get('/v1/fragments/non-existent-id.html')
      .auth('user1@email.com', 'password1');
    
    expect(res.statusCode).toBe(404);
  });

});