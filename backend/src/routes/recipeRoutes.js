const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getRecipeById, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe 
} = require('../controllers/recipeController');
const { createRating, getAverageRating } = require('../controllers/ratingController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: Get all recipes
 *     description: Retrieve all recipes with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of recipes
 */
router.get('/', getRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     tags: [Recipes]
 *     summary: Get a recipe by ID
 *     description: Retrieve a specific recipe by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     tags: [Recipes]
 *     summary: Create a new recipe
 *     description: Create a new recipe (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recipe created
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.post('/', protect, admin, createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     tags: [Recipes]
 *     summary: Update a recipe
 *     description: Update a recipe (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe updated
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Recipe not found
 */
router.put('/:id', protect, admin, updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     tags: [Recipes]
 *     summary: Delete a recipe
 *     description: Delete a recipe (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe removed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Recipe not found
 */
router.delete('/:id', protect, admin, deleteRecipe);

/**
 * @swagger
 * /api/recipes/{id}/rate:
 *   post:
 *     tags: [Ratings]
 *     summary: Rate a recipe
 *     description: Rate a recipe (authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Rating added
 *       200:
 *         description: Rating updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Recipe not found
 */
router.post('/:id/rate', protect, createRating);

/**
 * @swagger
 * /api/recipes/{id}/rating:
 *   get:
 *     tags: [Ratings]
 *     summary: Get average rating
 *     description: Get average rating for a recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Average rating
 */
router.get('/:id/rating', getAverageRating);

module.exports = router; 