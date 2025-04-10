const express = require('express');
const { authorize, protect } = require('../middlewares/auth.middlware');
const { getHotels, getHotel, createHotel, deleteHotel, ratingHotel, deleteRating } = require('../controllers/hotel.controller.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management endpoints
 */

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: List of all hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getHotels);

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the hotel
 *     responses:
 *       200:
 *         description: Hotel details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request or hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getHotel);

/**
 * @swagger
 * /hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotelName
 *               - address
 *               - website
 *               - description
 *               - tel
 *             properties:
 *               hotelName:
 *                 type: string
 *                 description: Name of the hotel
 *               address:
 *                 type: string
 *                 description: Physical address of the hotel
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Hotel's website URL
 *               description:
 *                 type: string
 *                 description: Detailed description of the hotel
 *               tel:
 *                 type: string
 *                 description: Contact number for the hotel
 *     responses:
 *       200:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, authorize('admin'), createHotel);

/**
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the hotel to delete
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request or hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', protect, authorize('admin'), deleteHotel);

/**
 * @swagger
 * /hotels/{id}/rating:
 *   put:
 *     summary: Add or update a rating for a hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the hotel to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating score (0-5)
 *               comment:
 *                 type: string
 *                 description: Optional review comment
 *     responses:
 *       200:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request or invalid rating score
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authorized - User must be logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/rating', protect, ratingHotel);

/**
 * @swagger
 * /hotels/{id}/rating/{ratingId}:
 *   delete:
 *     summary: Delete a rating from a hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the hotel
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the rating to delete
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request or rating not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authorized - Must be rating owner or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/rating/:ratingId', protect, deleteRating);

module.exports = router;