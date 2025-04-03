const express = require('express');
const usersController = require('../controllers/users');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve all users from the database.
 *     responses:
 *       200:
 *         description: Users list retrieved successfully.
*/
router.get('/', asyncHandler(usersController.getAll));

/**
 * @swagger
 * /users/{name}:
 *   get:
 *     summary: Get an array of users by name
 *     description: Retrieve a list of users whose first name matches the provided value (case-insensitive).
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The first name (or part of it) of the users to retrieve.
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the user.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   middle_name:
 *                     type: string
 *                     description: The middle name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     description: The email of the user.
 *                   birthdat:
 *                     type: string
 *                     format: date
 *                     description: The birth date of the user.
 *                   phone:
 *                     type: string
 *                     description: The phone number of the user.
 *       404:
 *         description: No users found with the given name.
 *       500:
 *         description: Internal server error.
*/
router.get('/:name', asyncHandler(usersController.getByName));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *               middle_name:
 *                 type: string
 *                 description: The middle name of the user.
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *               birthdat:
 *                 type: string
 *                 format: date
 *                 description: The birth date of the user.
 *               phone:
 *                 type: string
 *                 description: The phone number of the user.
 *               active:
 *                 type: boolean
 *                 description: Whether the user is active.
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
*/
router.post('/', asyncHandler(usersController.createUser));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Uptade user by ID
 *     description: Modifies the data of an existing user in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *               middle_name:
 *                 type: string
 *                 description: The middle name of the user.
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *               birthdat:
 *                 type: string
 *                 format: date
 *                 description: The birth date of the user.
 *               phone:
 *                 type: string
 *                 description: The phone number of the user.
 *               active:
 *                 type: boolean
 *                 description: Whether the user is active.
 *               deleted:
 *                 type: boolean
 *                 description: Indicates whether the user has been deleted.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *                 user:
 *                   type: object
 *                   description: User data updated.
 *       400:
 *         description: Validation error or email already registered.
 *       404:
 *         description: User not founded.
 *       500:
 *         description: Internal Server error.
*/
router.put('/:id', asyncHandler(usersController.updateUser));


module.exports = router;