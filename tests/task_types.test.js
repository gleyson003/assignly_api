// tests/tasks.test.js
const request = require('supertest');
const express = require('express');
const taskTypesRouter = require('../routes/task_types');
const taskTypesController = require('../controllers/task_types');

const app = express();
app.use(express.json());
app.use('/task-types', taskTypesRouter);

// Mock controller 
jest.mock('../controllers/task_types');
jest.mock('../middlewares/auth', () => (req, res, next) => next()); // mock auth


describe('Tests GET methodes /task-types', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /task-types should retorn status 200 and the tasks' list.", async () => {
    const fakeTaskTypes = [{ _id: '1', name: 'abc' }];
    
    taskTypesController.getAll.mockImplementation((req, res) => {
      res.status(200).json(fakeTaskTypes);
    });

    const response = await request(app).get('/task-types');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeTaskTypes);
  });

  test("GET /task-types/:name should return status 200 and the task's list by name.", async () => {
    const fakeTaskTypes = [{ name: 'gleyson' }];

    taskTypesController.getByName.mockImplementation((req, res) => {
      res.status(200).json(fakeTaskTypes);
    });

    const response = await request(app).get('/task-types/gleyson');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeTaskTypes);
  });

  test("GET /task-types/:name should retorn status 404 if any task wasn't founded.", async () => {
    taskTypesController.getByName.mockImplementation((req, res) => {
      res.status(404).json({ message: 'task-type not founded with this name!' });
    });

    const response = await request(app).get('/task-types/invalid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
