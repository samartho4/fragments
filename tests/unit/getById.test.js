const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app)
      .get('/v1/fragments/some-fragment-id')
      .expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/some-fragment-id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('returns 404 if the fragment is not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/nonexistent-fragment-id')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toContain('not found');
  });

});










