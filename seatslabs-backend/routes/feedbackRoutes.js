const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Customer feedback and complaints
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit feedback for a service
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *             properties:
 *               bookingId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/',
    authenticate,
    authorize('Customer'),
    feedbackController.submitFeedback
);

/**
 * @swagger
 * /feedback/my-feedback:
 *   get:
 *     summary: Get logged-in customer's feedback history
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submitted feedback
 */
router.get('/my-feedback',
    authenticate,
    authorize('Customer'),
    feedbackController.getCustomerFeedback
);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback (Manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all feedback
 */
router.get('/',
    authenticate,
    authorize('Manager'),
    feedbackController.getAllFeedback
);

/**
 * @swagger
 * /feedback/service/{serviceId}:
 *   get:
 *     summary: Get feedback for a specific service (Manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of feedback for the service
 */
router.get('/service/:serviceId',
    authenticate,
    authorize('Manager'),
    feedbackController.getFeedbackByService
);

/**
 * @swagger
 * /feedback/technician/{technicianId}:
 *   get:
 *     summary: Get feedback for a specific technician (Manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of feedback for the technician
 */
router.get('/technician/:technicianId',
    authenticate,
    authorize('Manager'),
    feedbackController.getFeedbackByTechnician
);

/**
 * @swagger
 * /feedback/complaints:
 *   post:
 *     summary: Submit a complaint
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Complaint submitted successfully
 */
router.post('/complaints',
    authenticate,
    authorize('Customer'),
    feedbackController.submitComplaint
);

/**
 * @swagger
 * /feedback/complaints:
 *   get:
 *     summary: Get all complaints (Manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/complaints',
    authenticate,
    authorize('Manager'),
    feedbackController.getAllComplaints
);

/**
 * @swagger
 * /feedback/complaints/{complaintId}/resolve:
 *   put:
 *     summary: Resolve a complaint (Manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: complaintId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolution
 *             properties:
 *               resolution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Complaint resolved
 */
router.put('/complaints/:complaintId/resolve',
    authenticate,
    authorize('Manager'),
    feedbackController.resolveComplaint
);

module.exports = router;