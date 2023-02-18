import request from 'supertest';
import connectDb from '../src/db';
import App from '../src/server';
import { User } from '../src/models/user.model';

describe('Test the user API endpoints', () => {
  beforeAll(async () => {
    await connectDb();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test('Test the root path', async () => {
    const response = await request(App.app)
      .get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  })

  test('POST /users', async () => {
    const res = await request(App.app)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('John Doe');
    expect(res.body.user.email).toBe('john.doe@example.com');
    expect(res.body.user.phoneNumber).toBe('1234567890');
  });

  test('POST /users with missing fields should return 400', async () => {
    const res = await request(App.app)
      .post('/users')
      .send({
        name: 'John Doe',
        password: 'password',
        phoneNumber: '1234567890',
      });
    expect(res.statusCode).toBe(400);
  });

  describe('POST /login', () => {
    test('should return 200 and a token if login successful', async () => {
      const password = "password123";
      const email = "user1@example.com";
      const user = new User({
        name: "test",
        email,
        password,
        phoneNumber: "test",
      });
      await user.save();
      const response = await request(App.app)
        .post('/login')
        .send({ email, password });
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test('should return 400 if login credentials are incorrect', async () => {
      const response = await request(App.app)
        .post('/login')
        .send({ email: 'user1@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(422);
    });
  });

  describe('GET /users', () => {
    test('should return 401 if not logged in', async () => {
      const response = await request(App.app).get('/users');
      expect(response.status).toBe(401);
    });

    test('should return list of users if logged in', async () => {
      const password = "password123";
      const email = "user1@example.com";
      const user = new User({
        name: "test",
        email,
        password,
        phoneNumber: "test",
      });
      await user.save();
      // First, log in to get the token
      const loginResponse = await request(App.app)
        .post('/login')
        .send({ email, password });
      const token = loginResponse.body.token;

      // Then, use the token to access the protected route
      const response = await request(App.app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

});
