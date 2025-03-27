const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

/**
 * @desc    Create or update a rating
 * @route   POST /api/recipes/:id/rate
 * @access  Private
 */
const createRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id;
    const recipeId = req.params.id;

    // Check if the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user has already rated this recipe
    const existingRating = await Rating.findOne({ userId, recipeId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();

      res.json({ message: 'Rating updated successfully' });
    } else {
      // Create new rating
      const newRating = new Rating({
        userId,
        recipeId,
        rating,
      });

      const savedRating = await newRating.save();

      // Add rating to recipe
      recipe.ratings.push(savedRating._id);
      await recipe.save();

      res.status(201).json({ message: 'Rating added successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get average rating for a recipe
 * @route   GET /api/recipes/:id/rating
 * @access  Public
 */
const getAverageRating = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Get all ratings for the recipe
    const ratings = await Rating.find({ recipeId });

    if (ratings.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.json({
      averageRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRating,
  getAverageRating,
}; 