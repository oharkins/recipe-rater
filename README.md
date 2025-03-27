# Recipe Rating Platform

A full-stack web application that allows users to view and rate recipes. Admins can add, edit, and delete recipes.

## Features

- User authentication with JWT
- Recipe listings with pagination
- Detailed recipe view
- 5-star rating system
- Admin dashboard for recipe management
- OpenAPI documentation

## Technology Stack

- **Frontend:** Angular
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT
- **API Documentation:** OpenAPI 3.0
- **Containerization:** Docker

## User Roles & Permissions

| Role  | Permissions |
|-------|-------------|
| Guest | View recipes |
| User  | View & rate recipes |
| Admin | Add, edit, and remove recipes |

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/recipe-ratings.git
   cd recipe-ratings
   ```

2. Start the application with Docker Compose
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: [http://localhost:4200](http://localhost:4200)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - API Documentation: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Development

### Backend

1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

## API Endpoints

- **Auth Endpoints**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and get token

- **Recipe Endpoints**
  - `GET /api/recipes` - Get all recipes
  - `GET /api/recipes/:id` - Get a single recipe
  - `POST /api/recipes` - Add a recipe (Admin only)
  - `PUT /api/recipes/:id` - Update a recipe (Admin only)
  - `DELETE /api/recipes/:id` - Delete a recipe (Admin only)

- **Rating Endpoints**
  - `POST /api/recipes/:id/rate` - Rate a recipe
  - `GET /api/recipes/:id/rating` - Get the average rating

## License

This project is licensed under the MIT License. 