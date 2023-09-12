const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');
// Write your tests here
beforeEach(async () => {
  await db.migrate.rollback(); 
  await db.migrate.latest();  

  await request(server)
  .post('/api/auth/register')
  .send({ username: 'testUser', password: 'testPass' });
});

afterEach(async () => {
  await db('users').truncate();  
});
test('sanity', () => {
  expect(true).toBe(true)
})

describe('POST /api/auth/register', () => {
  it('should return 201 on successful registration', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'JohnDoe', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('password');
  });

  it('should return an error if username or password is missing', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'JohnDoe' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('username and password required');
  });
});



describe('POST /api/auth/login', () => {

  it('should return 200 on successful login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: 'testPass' });  // replace with a valid user in your DB
    expect(res.status).toBe(200);
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: 'wrongPass' }); // replace with an invalid password for the user
    expect(res.status).toBe(401);
  });

});


// Tests for /api/jokes
// describe('GET /api/jokes', () => {
//   it('should return 401 if unauthorized', async () => {
//     const res = await request(server).get('/api/jokes');
//     expect(res.status).toBe(401);
//   });

//   it('should return 200 if authorized', async () => {
//     const loginResponse = await request(server)
//       .post('/api/auth/login')
//       .send({ username: 'JohnDoe', password: 'password123' });
//     const token = loginResponse.body.token;

//     const res = await request(server)
//       .get('/api/jokes')
//       .set('Authorization', token);

//     expect(res.status).toBe(200);
//   });
// });
describe('GET /api/jokes', () => {
  // it('should return 200 if authorized', async () => {
  //   const loginResponse = await request(server).post('/api/auth/login').send({ username: 'JohnDoe', password: 'password123' });
  //   const token = loginResponse.body.token;
  //   const res = await request(server).get('/api/jokes').set('Authorization', token);
  //   expect(res.status).toBe(200);
  // });
  it('should return 200 if authorized', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ username: 'JohnDoe', password: 'password123' });
    console.log('Login Response:', loginResponse.body); // Log the response body
  
    const token = loginResponse.body.token;
    
    if (!token) {
      throw new Error('Token not generated');
    }
  
    const res = await request(server).get('/api/jokes').set('Authorization', token);
    expect(res.status).toBe(200);
  });
  
  it('should return 401 if unauthorized', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
  });
});

