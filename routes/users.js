const express = require('express');
const usersController = require('../controllers/users');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user data
 *     description: Retrieve the currently logged-in user's data.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *       401:
 *         description: Unauthorized, token required.
*/
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.userId) });

        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
router.get('/', authMiddleware, asyncHandler(usersController.getAll));

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
 *               password:
 *                 type: string
 *                 description: The user's password.
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
router.post('/', authMiddleware, asyncHandler(usersController.createUser));

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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Permanently removes a user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully!
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
*/
router.delete('/:id', authMiddleware, asyncHandler(usersController.dropUser));

/**
 * @swagger
 * /users/{id}/toggle-active:
 *   patch:
 *     summary: Toggle the active status of a user
 *     description: Changes the user's active status between true and false.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to update.
 *     responses:
 *       200:
 *         description: User active status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activated successfully!
 *                 user:
 *                   type: object
 *                   description: Updated user data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-active', asyncHandler(usersController.toggleActiveUser));

/**
 * @swagger
 * /users/{id}/toggle-deleted:
 *   patch:
 *     summary: Toggle the deleted status of a user
 *     description: Marks the user as deleted or restores them.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to update.
 *     responses:
 *       200:
 *         description: User deleted status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User marked as deleted successfully!
 *                 user:
 *                   type: object
 *                   description: Updated user data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
*/
router.patch('/:id/toggle-deleted', asyncHandler(usersController.toggleDeletedUser));

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
*/
router.post('/login', asyncHandler(usersController.loginUser));


module.exports = router;