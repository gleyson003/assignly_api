const express = require('express');
const authMiddleware = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const tasksController = require('../controllers/tasks');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - taskTypeId
 *         - scheduleDate
 *         - scheduleHour
 *         - created_by
 *       properties:
 *         taskTypeId:
 *           type: string
 *         professionalId:
 *           type: string
 *         scheduleDate:
 *           type: string
 *           format: date
 *           example: "2025-04-12"
 *         scheduleHour:
 *           type: string
 *           pattern: "^([01]\\d|2[0-3]):[0-5]\\d$"
 *           example: "14:30"
 *         taskPrice:
 *           type: number
 *           example: 150.00
 *         created_by:
 *           type: string
 *         create_at:
 *           type: string
 *           format: date-time
 *         active:
 *           type: boolean
 *         deleted:
 *           type: boolean
*/

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get a list of tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Tasks list retrieved successfully.
*/
router.get('/', asyncHandler(tasksController.getAll));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by professional ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The professional ID
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
*/
router.get('/:id', asyncHandler(tasksController.getByProfessionalId));

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
*/
router.post('/', authMiddleware, asyncHandler(tasksController.createTask));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
*/
router.put('/:id', authMiddleware, asyncHandler(tasksController.updateTask));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, asyncHandler(tasksController.deleteTask));

/**
 * @swagger
 * /tasks/{id}/toggle-active:
 *   patch:
 *     summary: Toggle the active status of a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task active status updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/toggle-active', authMiddleware, asyncHandler(tasksController.toggleActive));

/**
 * @swagger
 * /tasks/{id}/toggle-deleted:
 *   patch:
 *     summary: Toggle the deleted status of a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted status updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
*/
router.patch('/:id/toggle-deleted', asyncHandler(tasksController.toggleDeleted));

module.exports = router;
