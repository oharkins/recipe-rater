const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: [
      'minute', 'minutes', 'min', 'm',
      'second', 'seconds', 'sec', 's',
      'hour', 'hours', 'hr', 'h'
    ]
  }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  description: String
}, { _id: false });

const videoSchema = new mongoose.Schema({
  youtube: String
}, { _id: false });

const ingredientSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  amount: Number,
  min: Number,
  max: Number,
  unit: {
    type: String,
    enum: [
      'cup', 'cups',
      'tablespoon', 'tablespoons', 'tbsp',
      'teaspoon', 'teaspoons', 'tsp',
      'pound', 'pounds', 'lb', 'lbs',
      'ounce', 'ounces', 'oz',
      'whole',
      'pinch',
      'dash', 'dashes',
      'to taste',
      'clove', 'cloves',
      'piece', 'pieces',
      'slice', 'slices',
      'can', 'cans',
      'jar', 'jars',
      'bottle', 'bottles',
      'package', 'packages',
      'box', 'boxes',
      'bag', 'bags',
      'head', 'heads',
      'bunch', 'bunches',
      'stalk', 'stalks',
      'sprig', 'sprigs',
      'leaf', 'leaves',
      'stick', 'sticks',
      'bar', 'bars',
      'block', 'blocks',
      'sheet', 'sheets',
      'roll', 'rolls',
      'rack', 'racks',
      'tube', 'tubes',
      'container', 'containers',
      'packet', 'packets',
      'envelope', 'envelopes',
      'carton', 'cartons',
      'quart', 'quarts',
      'pint', 'pints',
      'fluid ounce', 'fluid ounces', 'fl oz',
      'gallon', 'gallons',
      'milliliter', 'milliliters', 'ml',
      'liter', 'liters', 'l',
      'gram', 'grams', 'g',
      'kilogram', 'kilograms', 'kg',
      'milligram', 'milligrams', 'mg',
      'minute', 'minutes', 'min',
      'hour', 'hours', 'hr',
      'day', 'days',
      'week', 'weeks',
      'month', 'months',
      'year', 'years',
      'small', 'medium', 'large', 'extra large'
    ]
  }
}, { _id: false });

const equipmentSchema = new mongoose.Schema({
  item: String
}, { _id: false });

const stepSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  equipment: [equipmentSchema],
  prepTime: timeSchema,
  cookTime: timeSchema,
  images: [imageSchema],
  optional: Boolean
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  name: String,
  steps: [stepSchema]
}, { _id: false });

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  sodium: Number
}, { _id: false });

const preludeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  images: [imageSchema],
  videos: [videoSchema]
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  recipe: {
    type: String,
    required: true
  },
  source: String,
  spec: {
    type: String,
    required: true,
    enum: ['v0.1.0', 'v0.1.1', 'v0.1.2', 'v0.1.3']
  },
  tags: {
    type: String,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  yield: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  cuisine: String,
  dietaryRestrictions: {
    type: [String],
    enum: [
      'vegetarian',
      'vegan',
      'gluten-free',
      'dairy-free',
      'nut-free',
      'kosher',
      'halal',
      'keto',
      'paleo',
      'low-carb'
    ]
  },
  temperatureUnit: {
    type: String,
    enum: ['celsius', 'fahrenheit'],
    default: 'celsius'
  },
  totalTime: timeSchema,
  storage: String,
  nutrition: nutritionSchema,
  allIngredients: [ingredientSchema],
  allEquipment: [equipmentSchema],
  prelude: preludeSchema,
  preheat: Number,
  steps: [stepSchema],
  sections: [sectionSchema],
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Virtual for average rating
recipeSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  
  let sum = 0;
  this.ratings.forEach(rating => {
    sum += rating.rating;
  });
  
  return sum / this.ratings.length;
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe; 