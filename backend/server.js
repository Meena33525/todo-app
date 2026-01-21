// Import packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ==================== ROUTES ====================

// Route 1: GET /
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Todo App Backend!' });
});

// Route 2: GET /api/test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Route 3: POST /api/test
app.post('/api/test', (req, res) => {
  res.json({ message: 'POST test works!' });
});

// ==================== DEBUG ROUTES (VIEW DATABASE) ====================

// View all users
app.get('/api/debug/users', async (req, res) => {
  try {
    const { User } = require('./models');
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View all todos
app.get('/api/debug/todos', async (req, res) => {
  try {
    const { Todo } = require('./models');
    const todos = await Todo.findAll();
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUTH ROUTES ====================
// Import auth routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

// ==================== TODO ROUTES ====================
// Import todo routes (protected by auth middleware)
try {
  const todoRoutes = require('./routes/todos');
  app.use('/api/todos', todoRoutes);
  console.log('✅ Todo routes loaded');
} catch (error) {
  console.error('❌ Error loading todo routes:', error.message);
}

// ==================== DATABASE ====================
// Import database and models
const sequelize = require('./config/database');
const models = require('./models');

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ Database error:', err.message));

// ==================== START SERVER ====================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
});