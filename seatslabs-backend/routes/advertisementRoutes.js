const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: Advertisement campaign management
 */

/**
 * @swagger
 * /advertisements/campaigns:
 *   post:
 *     summary: Create a new ad campaign (Advertiser only)
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *               - pricingPlanId
 *             properties:
 *               title:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               pricingPlanId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Campaign created successfully
 */
router.post('/campaigns',
    authenticate,
    authorize('Advertiser'),
    advertisementController.createCampaign
);

/**
 * @swagger
 * /advertisements/campaigns/my-campaigns:
 *   get:
 *     summary: Get logged-in advertiser's campaigns
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get('/campaigns/my-campaigns',
    authenticate,
    authorize('Advertiser'),
    advertisementController.getAdvertiserCampaigns
);

/**
 * @swagger
 * /advertisements/campaigns/{campaignId}/ads:
 *   post:
 *     summary: Add an advertisement to a campaign (with media upload)
 *     tags: [Advertisements]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - media
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               targetUrl:
 *                 type: string
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Advertisement added successfully
 */
router.post('/campaigns/:campaignId/ads',
    authenticate,
    authorize('Advertiser'),
    upload.single('media'),
    advertisementController.createAdvertisement
);

/**
 * @swagger
 * /advertisements/campaigns/{campaignId}/analytics:
 *   get:
 *     summary: Get campaign analytics
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Campaign analytics data
 */
router.get('/campaigns/:campaignId/analytics',
    authenticate,
    authorize('Advertiser'),
    advertisementController.getCampaignAnalytics
);

router.put('/campaigns/:campaignId/pause',
    authenticate,
    authorize('Advertiser'),
    advertisementController.pauseCampaign
);

router.put('/campaigns/:campaignId/resume',
    authenticate,
    authorize('Advertiser'),
    advertisementController.resumeCampaign
);

/**
 * @swagger
 * /advertisements/campaigns:
 *   get:
 *     summary: Get all campaigns (Manager only)
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all campaigns
 */
router.get('/campaigns',
    authenticate,
    authorize('Manager'),
    advertisementController.getAllCampaigns
);

/**
 * @swagger
 * /advertisements/all-ads:
 *   get:
 *     summary: Get all advertisements (Manager only)
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all ads
 */
router.get('/all-ads',
    authenticate,
    authorize('Manager'),
    advertisementController.getAllAdvertisements
);

/**
 * @swagger
 * /advertisements/ads/{adId}/approve:
 *   put:
 *     summary: Approve an advertisement (Manager only)
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advertisement approved
 */
router.put('/ads/:adId/approve',
    authenticate,
    authorize('Manager'),
    advertisementController.approveAdvertisement
);

router.put('/ads/:adId/reject',
    authenticate,
    authorize('Manager'),
    advertisementController.rejectAdvertisement
);

/**
 * @swagger
 * /advertisements/pricing-plans:
 *   get:
 *     summary: Get ad pricing plans
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: List of pricing plans
 */
router.get('/pricing-plans', advertisementController.getPricingPlans);

router.post('/pricing-plans',
    authenticate,
    authorize('Manager'),
    advertisementController.createPricingPlan
);

/**
 * @swagger
 * /advertisements/active:
 *   get:
 *     summary: Get active advertisements for display
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: List of active ads
 */
router.get('/active', advertisementController.getActiveAdvertisements);
router.post('/track-impression', advertisementController.trackImpression);
router.post('/track-click', advertisementController.trackClick);

module.exports = router;