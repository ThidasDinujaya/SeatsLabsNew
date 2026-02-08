const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: System reporting and downloads
 */

// All report routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /reports/daily-booking:
 *   get:
 *     summary: Generate daily booking report (Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily booking report data
 */
router.get('/daily-booking', 
  authorize('Manager'), 
  reportController.generateDailyBookingReport
);

/**
 * @swagger
 * /reports/monthly-revenue:
 *   get:
 *     summary: Generate monthly revenue report (Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly revenue report data
 */
router.get('/monthly-revenue', 
  authorize('Manager'), 
  reportController.generateMonthlyRevenueReport
);

/**
 * @swagger
 * /reports/technician-performance:
 *   get:
 *     summary: Generate technician performance report (Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technician performance report data
 */
router.get('/technician-performance', 
  authorize('Manager'), 
  reportController.generateTechnicianPerformanceReport
);

/**
 * @swagger
 * /reports/customer-satisfaction:
 *   get:
 *     summary: Generate customer satisfaction report (Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer satisfaction report data
 */
router.get('/customer-satisfaction', 
  authorize('Manager'), 
  reportController.generateCustomerSatisfactionReport
);

/**
 * @swagger
 * /reports/advertisement-performance:
 *   get:
 *     summary: Generate ad performance report (Manager/Advertiser)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ad performance report data
 */
router.get('/advertisement-performance', 
  authorize('Manager', 'Advertiser'), 
  reportController.generateAdvertisementPerformanceReport
);

/**
 * @swagger
 * /reports/download/{filename}:
 *   get:
 *     summary: Download a generated report file
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File download
 */
router.get('/download/:filename', reportController.downloadReport);

module.exports = router;
