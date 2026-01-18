// Import Express - the framework for creating servers
const express = require('express');

// Import CORS - allows frontend to talk to backend
const cors = require('cors');

// Create an Express app
const app = express();

// Set the port (phone number) - 5000 is a common port
const PORT = 5000;

// Middleware - tells Express to allow requests from frontend
app.use(cors());

// Middleware - tells Express to understand JSON data
app.use(express.json());

// ==================== ROUTES ====================
// A route is like a phone extension: "Press 1 for customer service"

// Route 1: GET / (root route - when user visits http://localhost:5000/)
app.get('/', (req, res) => {
  // req = request (what the frontend asks)
  // res = response (what we send back)
  
  res.json({
    message: 'Welcome to Todo App Backend!',
    status: 'Server is running ✅'
  });
});

// Route 2: Simple test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'This is a test route',
    timestamp: new Date()
  });
});

// ==================== START SERVER ====================
// Listen on the port and start the server
// Import database and models
const sequelize = require('./config/database');
const { User, Todo } = require('./models');

// ==================== DATABASE SYNC ====================
// This tells Sequelize to create tables if they don't exist
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synchronized successfully');
}).catch((error) => {
  console.error('❌ Database sync error:', error);
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});