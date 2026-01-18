// Import DataTypes from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// We'll import User model to create relationship
const User = require('./User');

// Define the Todo model (table)
const Todo = sequelize.define('Todo', {
  // Column 1: id (automatically created)
  
  // Column 2: title
  title: {
    type: DataTypes.STRING,
    allowNull: false         // Title is required
  },

  // Column 3: description (optional)
  description: {
    type: DataTypes.TEXT,    // TEXT allows longer content
    allowNull: true          // Description can be empty
  },

  // Column 4: completed
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false      // New todos are not completed by default
  },

  // Column 5: userId (foreign key)
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,        // Every todo must belong to a user
    references: {
      model: User,           // References the User model
      key: 'id'              // Specifically the 'id' column in User table
    }
  }

  // Columns 6 & 7: createdAt and updatedAt
  // Created automatically by Sequelize
}, {
  timestamps: true           // Auto-create createdAt & updatedAt
});

// Export the Todo model
module.exports = Todo;