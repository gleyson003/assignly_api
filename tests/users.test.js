// tests/users.test.js
const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');
const usersController = require('../controllers/users');

const app = express();
app.use(express.json());
app.use('/users', usersRouter);

// Mock controller 
jest.mock('../controllers/users');
jest.mock('../middlewares/auth', () => (req, res, next) => next()); // mock auth


describe('Tests GET methodes /users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /users should retorn status 200 and the users' list.", async () => {
    const fakeUsers = [{ _id: '1', name: 'abc' }];
    
    // Simula o comportamento do controller
    usersController.getAll.mockImplementation((req, res) => {
      res.status(200).json(fakeUsers);
    });

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeUsers);
  });

  test("GET /users/:name should return status 200 and the users' list by name.", async () => {
    const fakeUsers = [{ name: 'gleyson' }];

    usersController.getByName.mockImplementation((req, res) => {
      res.status(200).json(fakeUsers);
    });

    const response = await request(app).get('/users/gleyson');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeUsers);
  });

  test("GET /users/:name should retorn status 404 if any user wasn't founded.", async () => {
    usersController.getByName.mockImplementation((req, res) => {
      res.status(404).json({ message: 'User not founded with this name!' });
    });

    const response = await request(app).get('/users/invalid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
