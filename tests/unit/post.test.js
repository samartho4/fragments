const request = require('supertest');
const app = require('../../src/app');

describe('POST routes', () => {
  describe('POST /v1/fragments', () => {
    
    test('Unauthenticated requests are denied', () =>
      request(app).post('/v1/fragments').expect(401));

    test('Incorrect credentials are denied', () =>
      request(app)
        .post('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('Should throw a 415 error when a Content-Type header is not provided in the request', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .send('Hello World');

      expect(res.status).toBe(415);
      expect(res.body).toEqual({
        status: 'error',
        error: {
          code: 415,
          message: 'Unsupported Content-Type',
        },
      });
    });

    test('Should throw a 415 error if a Content-Type header that is not supported by the API is passed', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/pdf')
        .send('This is a fragment');

      expect(res.status).toBe(415);
      expect(res.body).toEqual({
        status: 'error',
        error: {
          code: 415,
          message: 'Unsupported Content-Type',
        },
      });
    });

    

    test('Should reject fragments with an unsupported charset', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain; charset=unsupported')
        .send('Hello World');

      expect(res.status).toBe(415);
    });

    
    });
  });