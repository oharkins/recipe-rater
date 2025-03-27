const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Ratings API',
      version: '1.0.0',
      description: 'API for Recipe Ratings Platform',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Recipe: {
          type: 'object',
          required: ['title', 'author', 'ingredients', 'steps'],
          properties: {
            title: {
              type: 'string',
              description: 'Recipe title',
            },
            author: {
              type: 'string',
              description: 'Recipe author',
            },
            source: {
              type: 'string',
              description: 'Recipe source',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Recipe tags',
            },
            // Add other properties here
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routers
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Recipe Ratings API' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 