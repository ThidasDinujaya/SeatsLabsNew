const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service catalog and management
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /services/categories:
 *   get:
 *     summary: Get all service categories
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', serviceController.getAllCategories);

/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     summary: Get service details by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service details
 */
router.get('/:serviceId', serviceController.getServiceById);

// Manager only routes
router.post('/categories',
    authenticate,
    authorize('Manager'),
    serviceController.createCategory
);

router.post('/',
    authenticate,
    authorize('Manager'),
    serviceController.createService
);

router.put('/:serviceId',
    authenticate,
    authorize('Manager'),
    serviceController.updateService
);

router.delete('/:serviceId',
    authenticate,
    authorize('Manager'),
    serviceController.deleteService
);

router.put('/:serviceId/price',
    authenticate,
    authorize('Manager'),
    serviceController.updateServicePrice
);

router.put('/:serviceId/duration',
    authenticate,
    authorize('Manager'),
    serviceController.updateServiceDuration
);

module.exports = router;