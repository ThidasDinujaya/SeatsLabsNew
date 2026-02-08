const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateBooking } = require('../validators/bookingValidator');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Vehicle service booking and management
 */

/**
 * @swagger
 * /bookings/available-slots:
 *   get:
 *     summary: Get available time slots for a specific date
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available time slots
 */
router.get('/available-slots', bookingController.getAvailableSlots);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - serviceId
 *               - timeSlotId
 *             properties:
 *               vehicleId:
 *                 type: integer
 *               serviceId:
 *                 type: integer
 *               timeSlotId:
 *                 type: integer
 *               specialNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/',
    authenticate,
    authorize('Customer'),
    validateBooking,
    bookingController.createBooking
);

/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     summary: Get logged-in customer's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of customer bookings
 */
router.get('/my-bookings',
    authenticate,
    authorize('Customer'),
    bookingController.getCustomerBookings
);

/**
 * @swagger
 * /bookings/{bookingId}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 */
router.put('/:bookingId/cancel',
    authenticate,
    authorize('Customer'),
    bookingController.cancelBooking
);

/**
 * @swagger
 * /bookings/{bookingId}/reschedule:
 *   put:
 *     summary: Reschedule a booking
 *     tags: [Bookings]
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
 *               - timeSlotId
 *             properties:
 *               timeSlotId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking rescheduled successfully
 */
router.put('/:bookingId/reschedule',
    authenticate,
    authorize('Customer'),
    bookingController.rescheduleBooking
);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get('/',
    authenticate,
    authorize('Manager'),
    bookingController.getAllBookings
);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking details by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking details
 */
router.get('/:bookingId',
    authenticate,
    bookingController.getBookingById
);

/**
 * @swagger
 * /bookings/{bookingId}/approve:
 *   put:
 *     summary: Approve a booking (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking approved
 */
router.put('/:bookingId/approve',
    authenticate,
    authorize('Manager'),
    bookingController.approveBooking
);

/**
 * @swagger
 * /bookings/{bookingId}/reject:
 *   put:
 *     summary: Reject a booking (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking rejected
 */
router.put('/:bookingId/reject',
    authenticate,
    authorize('Manager'),
    bookingController.rejectBooking
);

/**
 * @swagger
 * /bookings/{bookingId}/assign-technician:
 *   put:
 *     summary: Assign a technician to a booking (Manager only)
 *     tags: [Bookings]
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
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 */
router.put('/:bookingId/assign-technician',
    authenticate,
    authorize('Manager'),
    bookingController.assignTechnician
);

// Technician Routes
router.get('/technician/my-jobs',
    authenticate,
    authorize('Technician'),
    bookingController.getTechnicianJobs
);

router.put('/:bookingId/status',
    authenticate,
    authorize('Technician', 'Manager'),
    bookingController.updateBookingStatus
);

router.post('/:bookingId/notes',
    authenticate,
    authorize('Technician'),
    bookingController.addServiceNotes
);

module.exports = router;
