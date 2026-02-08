const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put('/change-password', authenticate, userController.changePassword);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/account', authenticate, userController.deleteAccount);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/',
    authenticate,
    authorize('Manager'),
    userController.getAllUsers
);

/**
 * @swagger
 * /users/customers:
 *   get:
 *     summary: Get all customers (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/customers',
    authenticate,
    authorize('Manager'),
    userController.getAllCustomers
);

/**
 * @swagger
 * /users/technicians:
 *   get:
 *     summary: Get all technicians (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of technicians
 *   post:
 *     summary: Create a new technician (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phoneNumber
 *               - specialization
 *               - skillLevel
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               specialization:
 *                 type: string
 *               skillLevel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Technician created successfully
 */
router.get('/technicians',
    authenticate,
    authorize('Manager'),
    userController.getAllTechnicians
);

router.post('/technicians',
    authenticate,
    authorize('Manager'),
    userController.createTechnician
);

router.put('/technicians/:technicianId',
    authenticate,
    authorize('Manager'),
    userController.updateTechnician
);

router.delete('/technicians/:technicianId',
    authenticate,
    authorize('Manager'),
    userController.deleteTechnician
);

/**
 * @swagger
 * /users/advertisers:
 *   get:
 *     summary: Get all advertisers (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of advertisers
 */
router.get('/advertisers',
    authenticate,
    authorize('Manager'),
    userController.getAllAdvertisers
);

/**
 * @swagger
 * /users/advertisers/{advertiserId}/approve:
 *   put:
 *     summary: Approve an advertiser account (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: advertiserId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advertiser approved
 */
router.put('/advertisers/:advertiserId/approve',
    authenticate,
    authorize('Manager'),
    userController.approveAdvertiser
);

router.put('/users/:userId/activate',
    authenticate,
    authorize('Manager'),
    userController.activateUser
);

router.put('/users/:userId/deactivate',
    authenticate,
    authorize('Manager'),
    userController.deactivateUser
);

module.exports = router;