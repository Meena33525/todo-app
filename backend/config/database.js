// Import Sequelize
const { Sequelize } = require('sequelize');

// Import dotenv to load .env file
require('dotenv').config();

// Create a connection to PostgreSQL
// This is like dialing the database phone number
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name: todo_app
  process.env.DB_USER,      // Username: postgres
  process.env.DB_PASSWORD,  // Password: from .env file
  {
    host: process.env.DB_HOST,  // Server location: localhost
    port: process.env.DB_PORT,  // Port number: 5432
    dialect: 'postgres',         // Database type: PostgreSQL
    logging: false               // Don't show SQL queries (set to console.log to debug)
  }
);

// Export the connection
module.exports = sequelize;