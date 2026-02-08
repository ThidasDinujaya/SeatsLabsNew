const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications and messaging
 */

/**
 * @swagger
 * /notifications/my-notifications:
 *   get:
 *     summary: Get logged-in user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/my-notifications',
    authenticate,
    notificationController.getUserNotifications
);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put('/:notificationId/read',
    authenticate,
    notificationController.markAsRead
);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Mark all user's notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/mark-all-read',
    authenticate,
    notificationController.markAllAsRead
);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete('/:notificationId',
    authenticate,
    notificationController.deleteNotification
);

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Send a notification to a user (Manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */
router.post('/send',
    authenticate,
    authorize('Manager'),
    notificationController.sendNotification
);

/**
 * @swagger
 * /notifications/broadcast:
 *   post:
 *     summary: Broadcast a notification to all users (Manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification broadcasted successfully
 */
router.post('/broadcast',
    authenticate,
    authorize('Manager'),
    notificationController.broadcastNotification
);

/**
 * @swagger
 * /notifications/templates:
 *   get:
 *     summary: Get notification templates (Manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates
 *   post:
 *     summary: Create a notification template (Manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.get('/templates',
    authenticate,
    authorize('Manager'),
    notificationController.getTemplates
);

router.post('/templates',
    authenticate,
    authorize('Manager'),
    notificationController.createTemplate
);

module.exports = router;