# Recipe Seeding Script

This script fetches recipes from the GitHub repository [oharkins/personal-cookbook](https://github.com/oharkins/personal-cookbook/tree/main/recipes) and imports them into your local MongoDB database.

## Prerequisites

Before running the script, make sure you have:

1. MongoDB running (either locally or via Docker)
2. The `.env` file in the backend directory configured with:
   ```
   MONGODB_URI=mongodb://mongo:27017/recipe-ratings
   ADMIN_EMAIL=youremail@example.com
   ADMIN_PASSWORD=yourpassword
   ```

## Installation

Install the required dependencies:

```bash
cd backend
npm install
```

## Usage

Run the script from the backend directory:

```bash
cd backend
npm run seed
```

## What the Script Does

1. Connects to your MongoDB database
2. Finds or creates an admin user to associate with the recipes
3. Fetches all recipe JSON files from the GitHub repository
4. Parses each recipe and adapts it to the application's schema
5. Imports the recipes into your database, skipping any that already exist
6. Logs the progress and results

## Troubleshooting

- If you encounter GitHub API rate limiting, you may need to create a personal access token and add it to the script
- Make sure your MongoDB connection string is correct in the `.env` file
- Ensure you have proper network connectivity to access GitHub 