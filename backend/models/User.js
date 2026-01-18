// Import DataTypes from Sequelize
// DataTypes tells Sequelize what type each column is
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the User model (table)
const User = sequelize.define('User', {
  // Column 1: id (automatically created as primary key)
  // Sequelize creates this automatically
  
  // Column 2: email
  email: {
    type: DataTypes.STRING,
    allowNull: false,        // Email is required (cannot be empty)
    unique: true,            // No two users can have same email
    validate: {
      isEmail: true          // Must be valid email format
    }
  },

  // Column 3: password (hashed)
  password: {
    type: DataTypes.STRING,
    allowNull: false         // Password is required
  }

  // Columns 4 & 5: createdAt and updatedAt
  // Sequelize creates these automatically!
}, {
  timestamps: true           // Automatically add createdAt and updatedAt
});

// Export the User model
module.exports = User;