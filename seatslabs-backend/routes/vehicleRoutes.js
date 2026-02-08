const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management for customers
 */

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brandId
 *               - modelId
 *               - bodyTypeId
 *               - registrationNumber
 *               - manufactureYear
 *             properties:
 *               brandId:
 *                 type: integer
 *               modelId:
 *                 type: integer
 *               bodyTypeId:
 *                 type: integer
 *               registrationNumber:
 *                 type: string
 *               manufactureYear:
 *                 type: integer
 *               vehicleColor:
 *                 type: string
 *               vehicleMileage:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 */
router.post('/',
    authenticate,
    authorize('Customer'),
    vehicleController.addVehicle
);

/**
 * @swagger
 * /vehicles/my-vehicles:
 *   get:
 *     summary: Get logged-in customer's vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's vehicles
 */
router.get('/my-vehicles',
    authenticate,
    authorize('Customer'),
    vehicleController.getCustomerVehicles
);

/**
 * @swagger
 * /vehicles/{vehicleId}:
 *   put:
 *     summary: Update vehicle details
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleColor:
 *                 type: string
 *               vehicleMileage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 */
router.put('/:vehicleId',
    authenticate,
    authorize('Customer'),
    vehicleController.updateVehicle
);

router.delete('/:vehicleId',
    authenticate,
    authorize('Customer'),
    vehicleController.deleteVehicle
);

/**
 * @swagger
 * /vehicles/brands:
 *   get:
 *     summary: Get all vehicle brands
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicle brands
 */
router.get('/brands', vehicleController.getAllBrands);

/**
 * @swagger
 * /vehicles/models:
 *   get:
 *     summary: Get all vehicle models
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of all vehicle models
 */
router.get('/models', vehicleController.getAllModels);

/**
 * @swagger
 * /vehicles/brands/{brandId}/models:
 *   get:
 *     summary: Get models by brand ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of models for the brand
 */
router.get('/brands/:brandId/models', vehicleController.getModelsByBrand);

/**
 * @swagger
 * /vehicles/body-types:
 *   get:
 *     summary: Get all vehicle body types
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of body types
 */
router.get('/body-types', vehicleController.getAllBodyTypes);

// Manager routes (for managing brands/models)
router.post('/brands',
    authenticate,
    authorize('Manager'),
    vehicleController.createBrand
);

router.post('/models',
    authenticate,
    authorize('Manager'),
    vehicleController.createModel
);

router.post('/body-types',
    authenticate,
    authorize('Manager'),
    vehicleController.createBodyType
);

module.exports = router;