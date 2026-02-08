const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and management
 */

/**
 * @swagger
 * /payments/booking/{bookingId}:
 *   post:
 *     summary: Process payment for a booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
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
 *               - amount
 *               - paymentMethodId
 *               - transactionId
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethodId:
 *                 type: integer
 *               transactionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment successful
 */
router.post('/booking/:bookingId',
    authenticate,
    authorize('Customer'),
    paymentController.processBookingPayment
);

/**
 * @swagger
 * /payments/my-payments:
 *   get:
 *     summary: Get logged-in customer's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/my-payments',
    authenticate,
    authorize('Customer'),
    paymentController.getCustomerPayments
);

/**
 * @swagger
 * /payments/advertisement/{campaignId}:
 *   post:
 *     summary: Process payment for an advertisement campaign
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
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
 *               - amount
 *               - transactionId
 *             properties:
 *               amount:
 *                 type: number
 *               transactionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment successful
 */
router.post('/advertisement/:campaignId',
    authenticate,
    authorize('Advertiser'),
    paymentController.processAdPayment
);

router.get('/advertisement/my-payments',
    authenticate,
    authorize('Advertiser'),
    paymentController.getAdvertiserPayments
);

// Manager routes
router.get('/',
    authenticate,
    authorize('Manager'),
    paymentController.getAllPayments
);

/**
 * @swagger
 * /payments/methods:
 *   get:
 *     summary: Get active payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment methods
 */
router.get('/methods', paymentController.getPaymentMethods);

router.post('/methods',
    authenticate,
    authorize('Manager'),
    paymentController.createPaymentMethod
);

router.put('/:paymentId/verify',
    authenticate,
    authorize('Manager'),
    paymentController.verifyPayment
);

router.post('/:paymentId/refund',
    authenticate,
    authorize('Manager'),
    paymentController.processRefund
);

module.exports = router;