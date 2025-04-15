// tests/users.test.js
const request = require('supertest');
const express = require('express');
const userTypesRouter = require('../routes/user_types');
const userTypesController = require('../controllers/user_types');

const app = express();
app.use(express.json());
app.use('/user-types', userTypesRouter);

// Mock controller 
jest.mock('../controllers/user_types');
jest.mock('../middlewares/auth', () => (req, res, next) => next()); // mock auth


describe('Tests GET methodes /user-types', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /user-types should retorn status 200 and the users' list.", async () => {
    const fakeUserTypes = [{ _id: '1', name: 'abc' }];
    
    userTypesController.getAll.mockImplementation((req, res) => {
      res.status(200).json(fakeUserTypes);
    });

    const response = await request(app).get('/user-types');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeUserTypes);
  });

  test("GET /user-types/:name should return status 200 and the users' list by name.", async () => {
    const fakeUserTypes = [{ name: 'gleyson' }];

    userTypesController.getByName.mockImplementation((req, res) => {
      res.status(200).json(fakeUserTypes);
    });

    const response = await request(app).get('/user-types/gleyson');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeUserTypes);
  });

  test("GET /user-types/:name should retorn status 404 if any user wasn't founded.", async () => {
    userTypesController.getByName.mockImplementation((req, res) => {
      res.status(404).json({ message: 'User-type not founded with this name!' });
    });

    const response = await request(app).get('/user-types/invalid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
