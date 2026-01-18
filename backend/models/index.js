// Import both models
const User = require('./User');
const Todo = require('./Todo');

// Define relationship: One User has Many Todos
// This means:
// - User 1 can have multiple todos
// - Each todo belongs to only one user
User.hasMany(Todo, {
  foreignKey: 'userId',      // Todo.userId links to User.id
  onDelete: 'CASCADE'         // If user is deleted, delete their todos too
});

// Define the reverse relationship
Todo.belongsTo(User, {
  foreignKey: 'userId'
});

// Export models so other files can use them
module.exports = {
  User,
  Todo,
  sequelize: require('../config/database')
};