const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Todo, User } = require('../models');

// ==================== PROTECT ALL ROUTES ====================
// Apply auth middleware to ALL routes in this file
// This means user MUST be logged in to access any todo endpoint
router.use(authMiddleware);

// ==================== CREATE TODO ====================
// POST /api/todos
// Create a new todo for the logged-in user
router.post('/', async (req, res) => {
  try {
    // Get data from request body
    const { title, description } = req.body;

    // Get user ID from the token (added by authMiddleware)
    const userId = req.user.id;

    // Validation: title is required
    if (!title) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    // Create todo in database
    const todo = await Todo.create({
      title,
      description: description || null,  // description is optional
      completed: false,                   // new todos are not completed
      userId                              // link todo to user
    });

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });

  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      error: 'Server error while creating todo'
    });
  }
});

// ==================== GET USER'S TODOS ====================
// GET /api/todos
// Get all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user.id;

    // Find all todos where userId matches
    // Sort by creation date (newest first)
    const todos = await Todo.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Todos retrieved successfully',
      todos
    });

  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      error: 'Server error while fetching todos'
    });
  }
});

// ==================== GET SINGLE TODO ====================
// GET /api/todos/:id
// Get a specific todo by ID (only if user owns it)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find todo by ID AND check if user owns it
    const todo = await Todo.findOne({
      where: { id, userId }
    });

    // If todo doesn't exist or doesn't belong to user
    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found'
      });
    }

    res.json({
      message: 'Todo retrieved successfully',
      todo
    });

  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      error: 'Server error while fetching todo'
    });
  }
});

// ==================== UPDATE TODO ====================
// PUT /api/todos/:id
// Update a todo (only if user owns it)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, completed } = req.body;

    // Find todo and check ownership
    const todo = await Todo.findOne({
      where: { id, userId }
    });

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found'
      });
    }

    // Validation: title is required if provided
    if (title && !title.trim()) {
      return res.status(400).json({
        error: 'Title cannot be empty'
      });
    }

    // Update todo with new data
    await todo.update({
      title: title || todo.title,              // keep old title if not provided
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed
    });

    res.json({
      message: 'Todo updated successfully',
      todo
    });

  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      error: 'Server error while updating todo'
    });
  }
});

// ==================== DELETE TODO ====================
// DELETE /api/todos/:id
// Delete a todo (only if user owns it)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find todo and check ownership
    const todo = await Todo.findOne({
      where: { id, userId }
    });

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found'
      });
    }

    // Delete the todo
    await todo.destroy();

    res.json({
      message: 'Todo deleted successfully',
      todo
    });

  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      error: 'Server error while deleting todo'
    });
  }
});

// Export router
module.exports = router;