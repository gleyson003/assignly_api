const express = require('express');
const userTypesController = require('../controllers/user_types');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /user-types:
 *   get:
 *     summary: Get a list of user types
 *     description: Retrieve all user types from the database.
 *     tags:
 *       - User Types
 *     responses:
 *       200:
 *         description: User types list retrieved successfully.
 */
router.get('/', asyncHandler(userTypesController.getAll));

/**
 * @swagger
 * /user-types/{name}:
 *   get:
 *     summary: Get user types by name
 *     description: Retrieve user types whose name matches the provided value (case-insensitive).
 *     tags:
 *       - User Types
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the user type to search for.
 *     responses:
 *       200:
 *         description: User types retrieved successfully.
 *       404:
 *         description: No user types found with the given name.
 *       500:
 *         description: Internal server error.
 */
router.get('/:name', asyncHandler(userTypesController.getByName));

/**
 * @swagger
 * /user-types:
 *   post:
 *     summary: Create a new user type
 *     description: Adds a new user type to the database.
 *     tags:
 *       - User Types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user type.
 *               description:
 *                 type: string
 *                 description: A brief description of the user type.
 *     responses:
 *       201:
 *         description: User type created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/', authMiddleware, asyncHandler(userTypesController.createUserTypes));

/**
 * @swagger
 * /user-types/{id}:
 *   put:
 *     summary: Update a user type by ID
 *     description: Updates the data of an existing user type in the database.
 *     tags:
 *       - User Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user type ID to update.
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
 *         description: User type updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: User type not found.
 *       500:
 *         description: Internal server error.
*/
router.put('/:id', authMiddleware, asyncHandler(userTypesController.updateUserTypes));

/**
 * @swagger
 * /user-types/{id}:
 *   delete:
 *     summary: Delete a user type by ID
 *     description: Permanently removes a user type from the database.
 *     tags:
 *       - User Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user type ID to delete.
 *     responses:
 *       200:
 *         description: User type deleted successfully.
 *       404:
 *         description: User type not found.
 *       500:
 *         description: Internal server error.
*/
router.delete('/:id', authMiddleware, asyncHandler(userTypesController.dropUserTypes));

/**
 * @swagger
 * /user-types/{id}/toggle-active:
 *   patch:
 *     summary: Toggle the active status of a user type
 *     description: Switches the active status of a user type between true and false.
 *     tags:
 *       - User Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user type ID to update.
 *     responses:
 *       200:
 *         description: Active status updated successfully.
 *       404:
 *         description: User type not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-active', asyncHandler(userTypesController.activeUserTypes));

/**
 * @swagger
 * /user-types/{id}/toggle-deleted:
 *   patch:
 *     summary: Toggle the deleted status of a user type
 *     description: Marks the user type as deleted or restores it.
 *     tags:
 *       - User Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user type ID to update.
 *     responses:
 *       200:
 *         description: Deleted status updated successfully.
 *       404:
 *         description: User type not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-deleted', asyncHandler(userTypesController.deletedUserTypes));

module.exports = router;
