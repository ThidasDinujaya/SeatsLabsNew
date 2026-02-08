const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System analytics and statistics (Manager only)
 */

// All analytics routes require Manager authentication
router.use(authenticate);
router.use(authorize('Manager'));

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get main dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics (revenue, bookings, users)
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @swagger
 * /analytics/booking-trends:
 *   get:
 *     summary: Get booking trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *     responses:
 *       200:
 *         description: Booking trend data
 */
router.get('/booking-trends', analyticsController.getBookingTrends);

/**
 * @swagger
 * /analytics/revenue-analysis:
 *   get:
 *     summary: Get revenue analysis
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue breakdown
 */
router.get('/revenue-analysis', analyticsController.getRevenueAnalysis);

/**
 * @swagger
 * /analytics/service-popularity:
 *   get:
 *     summary: Get service popularity metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service usage statistics
 */
router.get('/service-popularity', analyticsController.getServicePopularity);

/**
 * @swagger
 * /analytics/peak-hours:
 *   get:
 *     summary: Get peak booking hours
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Peak hour analysis
 */
router.get('/peak-hours', analyticsController.getPeakHours);

/**
 * @swagger
 * /analytics/customer-retention:
 *   get:
 *     summary: Get customer retention metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer retention data
 */
router.get('/customer-retention', analyticsController.getCustomerRetention);

/**
 * @swagger
 * /analytics/technician-utilization:
 *   get:
 *     summary: Get technician utilization metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technician workload stats
 */
router.get('/technician-utilization', analyticsController.getTechnicianUtilization);

/**
 * @swagger
 * /analytics/advertisement-roi:
 *   get:
 *     summary: Get advertisement ROI metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ad performance metrics
 */
router.get('/advertisement-roi', analyticsController.getAdvertisementROI);

module.exports = router;