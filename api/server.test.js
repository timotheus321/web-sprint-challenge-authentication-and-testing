const request = require('supertest');
const server = require('./server');
// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})
// Tests for /api/auth/register
describe('POST /api/auth/register', () => {
  it('should return 201 on successful registration', async () => {
    // your code here
  });

  it('should return an error if username or password is missing', async () => {
    // your code here
  });
});

// Tests for /api/auth/login
describe('POST /api/auth/login', () => {
  it('should return 200 on successful login', async () => {
    // your code here
  });

  it('should return an error on failed login due to missing credentials', async () => {
    // your code here
  });
});

// Tests for /api/jokes
describe('GET /api/jokes', () => {
  it('should return 401 if unauthorized', async () => {
    // your code here
  });

  it('should return 200 and a list of jokes if authorized', async () => {
    // your code here
  });
});
