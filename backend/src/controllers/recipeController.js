const Recipe = require('../models/Recipe');
const Rating = require('../models/Rating');

/**
 * @desc    Get all recipes
 * @route   GET /api/recipes
 * @access  Public
 */
const getRecipes = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .populate('ratings', 'rating')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize),
      totalRecipes: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('ratings', 'rating userId')
      .populate('createdBy', 'name');

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Recipe not found' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

/**
 * @desc    Create a recipe
 * @route   POST /api/recipes
 * @access  Private/Admin
 */
const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user._id,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a recipe
 * @route   PUT /api/recipes/:id
 * @access  Private/Admin
 */
const updateRecipe = async (req, res) => {
  try {
    const {
      recipe,
      author,
      source,
      spec,
      tags,
      servings,
      yield,
      difficulty,
      cuisine,
      dietaryRestrictions,
      temperatureUnit,
      totalTime,
      storage,
      nutrition,
      allIngredients,
      allEquipment,
      prelude,
      preheat,
      steps,
      sections,
    } = req.body;

    const recipeDoc = await Recipe.findById(req.params.id);

    if (recipeDoc) {
      recipeDoc.recipe = recipe || recipeDoc.recipe;
      recipeDoc.author = author || recipeDoc.author;
      recipeDoc.source = source || recipeDoc.source;
      recipeDoc.spec = spec || recipeDoc.spec;
      recipeDoc.tags = tags || recipeDoc.tags;
      recipeDoc.servings = servings || recipeDoc.servings;
      recipeDoc.yield = yield || recipeDoc.yield;
      recipeDoc.difficulty = difficulty || recipeDoc.difficulty;
      recipeDoc.cuisine = cuisine || recipeDoc.cuisine;
      recipeDoc.dietaryRestrictions = dietaryRestrictions || recipeDoc.dietaryRestrictions;
      recipeDoc.temperatureUnit = temperatureUnit || recipeDoc.temperatureUnit;
      recipeDoc.totalTime = totalTime || recipeDoc.totalTime;
      recipeDoc.storage = storage || recipeDoc.storage;
      recipeDoc.nutrition = nutrition || recipeDoc.nutrition;
      recipeDoc.allIngredients = allIngredients || recipeDoc.allIngredients;
      recipeDoc.allEquipment = allEquipment || recipeDoc.allEquipment;
      recipeDoc.prelude = prelude || recipeDoc.prelude;
      recipeDoc.preheat = preheat || recipeDoc.preheat;
      recipeDoc.steps = steps || recipeDoc.steps;
      recipeDoc.sections = sections || recipeDoc.sections;

      const updatedRecipe = await recipeDoc.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Recipe not found' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

/**
 * @desc    Delete a recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private/Admin
 */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      // Delete all ratings associated with this recipe
      await Rating.deleteMany({ recipeId: recipe._id });
      
      await recipe.remove();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Recipe not found' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
}; 