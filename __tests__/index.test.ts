import request from 'supertest';
import connectDb from '../src/db';
import App from '../src/server';
import User from '../src/models/user.model';

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
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john.doe@example.com');
    expect(res.body.phoneNumber).toBe('1234567890');
  });

  test('POST /users with missing fields should return 400', async () => {
    const res = await request(App.app)
      .post('/users')
      .send({
        name: 'John Doe',
        password: 'password',
        phoneNumber: '1234567890',
      });
    expect(res.statusCode).toBe(500);
  });
});
