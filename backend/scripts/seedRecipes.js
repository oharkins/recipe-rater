const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Recipe = require('../src/models/Recipe');
const User = require('../src/models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Function to fetch repository contents
async function fetchGitHubRepositoryContents(owner, repo, path) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching GitHub repository: ${error.message}`);
    throw error;
  }
}

// Function to fetch file content from GitHub
async function fetchFileContent(url) {
  try {
    const response = await axios.get(url);
    // If the content is a string, try to parse it as JSON
    if (typeof response.data === 'string') {
      try {
        return JSON.parse(response.data);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);
        return response.data;
      }
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching file content: ${error.message}`);
    throw error;
  }
}

// Parse recipe JSON and adapt to our schema
function parseRecipe(recipeData, userId) {
  try {
    // Debug the recipe data
    console.log('Recipe data:', JSON.stringify(recipeData).substring(0, 200) + '...');
    
    // Extract title from recipe name or data
    let recipeTitle = 'Untitled Recipe';
    if (recipeData.name) {
      recipeTitle = recipeData.name;
    } else if (recipeData.title) {
      recipeTitle = recipeData.title;
    } else if (recipeData.recipe) {
      recipeTitle = recipeData.recipe;
    } else if (recipeData.filename) {
      // If we have a filename, use it as a fallback
      recipeTitle = recipeData.filename
        .replace('.json', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Ensure we have a valid title
    if (!recipeTitle || recipeTitle === 'undefined') {
      recipeTitle = 'Untitled Recipe';
    }
    
    // Handle time objects
    const parseTime = (timeData) => {
      if (!timeData) return null;
      if (typeof timeData === 'object' && timeData !== null) {
        return {
          amount: Number(timeData.amount) || 0,
          unit: timeData.unit || 'minutes'
        };
      }
      // If it's a string, try to parse it
      const match = String(timeData).match(/(\d+)\s*(\w+)/);
      if (match) {
        return {
          amount: Number(match[1]),
          unit: match[2]
        };
      }
      return null;
    };

    // Process steps to match schema
    let processedSteps = [];
    if (Array.isArray(recipeData.steps)) {
      processedSteps = recipeData.steps.map(step => {
        let description = '';
        if (typeof step === 'object') {
          if (Object.keys(step).every(key => !isNaN(key))) {
            description = Object.values(step).join('');
          } else if (step.description) {
            description = step.description;
          } else {
            description = JSON.stringify(step);
          }
        } else {
          description = String(step);
        }
        return {
          description,
          ingredients: [],
          equipment: [],
          prepTime: null,
          cookTime: null,
          images: [],
          optional: false
        };
      });
    }

    // Process images
    const processImages = (imageData) => {
      if (!imageData) return [];
      if (typeof imageData === 'string') {
        return [{ src: imageData, description: '' }];
      }
      if (Array.isArray(imageData)) {
        return imageData.map(img => ({
          src: typeof img === 'string' ? img : img.src || '',
          description: typeof img === 'object' ? img.description || '' : ''
        }));
      }
      return [];
    };

    // Process ingredients
    const processIngredients = (ingredients) => {
      if (!ingredients) return [];
      return ingredients.map(ing => {
        if (typeof ing === 'string') {
          return { item: ing, amount: null, unit: null };
        }
        return {
          item: ing.name || ing.item || '',
          amount: Number(ing.amount) || null,
          unit: ing.unit || null
        };
      });
    };

    // Process equipment
    const processEquipment = (equipment) => {
      if (!equipment) return [];
      return equipment.map(item => ({
        item: typeof item === 'string' ? item : item.item || ''
      }));
    };

    // Map the GitHub recipe format to our database schema
    return {
      author: recipeData.author || 'Unknown',
      recipe: recipeTitle,
      source: recipeData.source || '',
      spec: recipeData.specVersion || 'v0.1.0',
      tags: Array.isArray(recipeData.tags) ? recipeData.tags.join(', ') : recipeData.tags || '',
      servings: Number(recipeData.servings) || 1,
      yield: recipeData.yield || '',
      difficulty: recipeData.difficulty || 'beginner',
      cuisine: recipeData.cuisine || '',
      dietaryRestrictions: recipeData.dietaryRestrictions || [],
      temperatureUnit: recipeData.temperatureUnit || 'celsius',
      totalTime: parseTime(recipeData.totalTime),
      storage: recipeData.storage || '',
      nutrition: {
        calories: Number(recipeData.nutrition?.calories) || null,
        protein: Number(recipeData.nutrition?.protein) || null,
        carbohydrates: Number(recipeData.nutrition?.carbs) || null,
        fat: Number(recipeData.nutrition?.fat) || null,
        fiber: Number(recipeData.nutrition?.fiber) || null,
        sugar: Number(recipeData.nutrition?.sugar) || null,
        sodium: Number(recipeData.nutrition?.sodium) || null
      },
      allIngredients: processIngredients(recipeData.ingredients),
      allEquipment: processEquipment(recipeData.equipment),
      prelude: {
        description: recipeData.description || recipeData.summary || recipeData.notes || recipeTitle,
        images: processImages(recipeData.image),
        videos: recipeData.videos ? [{ youtube: recipeData.videos.youtube || '' }] : []
      },
      preheat: Number(recipeData.preheat) || null,
      steps: processedSteps,
      sections: recipeData.sections?.map(section => ({
        name: section.title || '',
        steps: Array.isArray(section.steps) ? section.steps.map(step => ({
          description: String(step),
          ingredients: [],
          equipment: [],
          prepTime: null,
          cookTime: null,
          images: [],
          optional: false
        })) : []
      })) || [],
      createdBy: userId
    };
  } catch (error) {
    console.error(`Error parsing recipe: ${error.message}`);
    throw error;
  }
}

// Main function to seed the database
async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing recipes if needed
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');
    
    // Find the admin user (or any user to associate recipes with)
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@example.com' });
    
    if (!admin) {
      console.log('Creating admin user...');
      const adminUser = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'password123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created');
      var userId = adminUser._id;
    } else {
      console.log('Admin user found');
      var userId = admin._id;
    }
    
    // Fetch recipes from GitHub repository
    const owner = 'oharkins';
    const repo = 'personal-cookbook';
    const repoPath = 'recipes';
    
    console.log(`Fetching recipes from GitHub: ${owner}/${repo}/${repoPath}`);
    const files = await fetchGitHubRepositoryContents(owner, repo, repoPath);
    
    // Process each recipe file
    for (const file of files) {
      if (file.name.endsWith('.json')) {
        console.log(`Processing recipe: ${file.name}`);
        
        // Fetch the content of the recipe file
        const content = await fetchFileContent(file.download_url);
        
        // Generate a title from the filename if needed
        const filenameWithoutExt = file.name.replace('.json', '');
        const titleFromFilename = filenameWithoutExt
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Create a data object with the title from filename as fallback
        const recipeWithTitle = {
          ...content,
          title: content.title || content.name || titleFromFilename
        };
        
        // Parse the recipe and create a new record
        const recipeData = parseRecipe(recipeWithTitle, userId);
        
        // Check if recipe already exists
        const existingRecipe = await Recipe.findOne({ recipe: recipeData.recipe });
        
        if (existingRecipe) {
          console.log(`Recipe "${recipeData.recipe}" already exists, skipping`);
        } else {
          // Create the recipe
          const recipe = new Recipe(recipeData);
          await recipe.save();
          console.log(`Recipe "${recipeData.recipe}" imported successfully`);
        }
      }
    }
    
    console.log('Recipe import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 