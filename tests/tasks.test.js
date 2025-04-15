// tests/tasks.test.js
const request = require('supertest');
const express = require('express');
const tasksRouter = require('../routes/tasks');
const tasksController = require('../controllers/tasks');

// Mock do controller (só GETs por enquanto)
jest.mock('../controllers/tasks');

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);

describe('Tests GET methodes /tasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /tasks should retorn status 200 and the task's list.", async () => {
    const fakeTasks = [{ _id: '1', taskTypeId: 'abc', scheduleDate: '2025-04-12' }];
    
    // Simula o comportamento do controller
    tasksController.getAll.mockImplementation((req, res) => {
      res.status(200).json(fakeTasks);
    });

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeTasks);
  });

  test("GET /tasks/:id should return status 200 and the task's list by professionalId.", async () => {
    const fakeTasks = [{ professionalId: '67f83a00d4ef77ea61df8846' }];

    tasksController.getByProfessionalId.mockImplementation((req, res) => {
      res.status(200).json(fakeTasks);
    });

    const response = await request(app).get('/tasks/67f83a00d4ef77ea61df8846');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeTasks);
  });

  test("GET /tasks/:id should retorn status 404 if any task wasn't founded.", async () => {
    tasksController.getByProfessionalId.mockImplementation((req, res) => {
      res.status(404).json({ message: 'Task not founded with this professional!' });
    });

    const response = await request(app).get('/tasks/invalid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
