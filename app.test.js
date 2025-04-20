const request = require('supertest');
const app = require('./app');  // Import the app from app.js

describe('GET /', () => {
  it('should return "Hello, world!"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, world!');
  });
});

describe('GET /secret', () => {
  it('should return 401 Unauthorized for incorrect credentials', async () => {
    const res = await request(app)
      .get('/secret')
      .auth('wronguser', 'wrongpass'); // Invalid credentials

    expect(res.statusCode).toBe(401);
    expect(res.text).toBe('Authentication required');
  });

  it('should return the secret message for correct credentials', async () => {
    const res = await request(app)
      .get('/secret')
      .auth(process.env.USERNAME, process.env.PASSWORD);  // Valid credentials

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(process.env.SECRET_MESSAGE);
  });
});
