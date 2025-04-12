const express = require('express');
const taskTypesController = require('../controllers/task_types');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /task-types:
 *   get:
 *     summary: Get a list of task-types
 *     description: Retrieve all task types from the database.
 *     tags:
 *       - Task Types
 *     responses:
 *       200:
 *         description: Task types list retrieved successfully.
 */
router.get('/', asyncHandler(taskTypesController.getAll));

/**
 * @swagger
 * /task-types/{name}:
 *   get:
 *     summary: Get task types by name
 *     description: Retrieve task types whose name matches the provided value (case-insensitive).
 *     tags:
 *       - Task Types
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the task type to search for.
 *     responses:
 *       200:
 *         description: Task types retrieved successfully.
 *       404:
 *         description: No task types found with the given name.
 *       500:
 *         description: Internal server error.
 */
router.get('/:name', asyncHandler(taskTypesController.getByName));

/**
 * @swagger
 * /task-types:
 *   post:
 *     summary: Create a new task type
 *     description: Adds a new task type to the database.
 *     tags:
 *       - Task Types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task type.
 *               description:
 *                 type: string
 *                 description: A brief description of the task type.
 *     responses:
 *       201:
 *         description: Task type created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/', authMiddleware, asyncHandler(taskTypesController.createTaskTypes));

/**
 * @swagger
 * /task-types/{id}:
 *   put:
 *     summary: Update a task type by ID
 *     description: Updates the data of an existing task type in the database.
 *     tags:
 *       - Task Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task type ID to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task type updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Task type not found.
 *       500:
 *         description: Internal server error.
*/
router.put('/:id', authMiddleware, asyncHandler(taskTypesController.updateTaskTypes));

/**
 * @swagger
 * /task-types/{id}:
 *   delete:
 *     summary: Delete a task type by ID
 *     description: Permanently removes a task type from the database.
 *     tags:
 *       - Task Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task type ID to delete.
 *     responses:
 *       200:
 *         description: Task type deleted successfully.
 *       404:
 *         description: Task type not found.
 *       500:
 *         description: Internal server error.
*/
router.delete('/:id', authMiddleware, asyncHandler(taskTypesController.dropTaskTypes));

/**
 * @swagger
 * /task-types/{id}/toggle-active:
 *   patch:
 *     summary: Toggle the active status of a task type
 *     description: Switches the active status of a task type between true and false.
 *     tags:
 *       - Task Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task type ID to update.
 *     responses:
 *       200:
 *         description: Active status updated successfully.
 *       404:
 *         description: Task type not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-active', asyncHandler(taskTypesController.activeTaskTypes));

/**
 * @swagger
 * /task-types/{id}/toggle-deleted:
 *   patch:
 *     summary: Toggle the deleted status of a task type
 *     description: Marks the task type as deleted or restores it.
 *     tags:
 *       - Task Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task type ID to update.
 *     responses:
 *       200:
 *         description: Deleted status updated successfully.
 *       404:
 *         description: Task type not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-deleted', asyncHandler(taskTypesController.deletedTaskTypes));

module.exports = router;
