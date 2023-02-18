import request from 'supertest';
import app from '../src/index';
import http from 'http';

let server: http.Server

describe('Test the root path', () => {
  test('It should return "Hello World!"', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello World!');
  });
});
