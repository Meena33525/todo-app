const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// ==================== SIGNUP ROUTE ====================
// POST /api/auth/signup
// User creates a new account
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Validation: Check if password is at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered'
      });
    }

    // Hash the password using bcrypt
    // bcrypt.hash(password, saltRounds)
    // saltRounds = 10 means "scramble 10 times" (more secure)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const user = await User.create({
      email,
      password: hashedPassword  // Store hashed password, not plain text!
    });

    // Create JWT token
    // Token contains: user id, email, and expiry time (24 hours)
    const token = jwt.sign(
      { id: user.id, email: user.email },  // Data to store in token
      process.env.JWT_SECRET,              // Secret key from .env
      { expiresIn: '24h' }                 // Token expires in 24 hours
    );

    // Send response with token
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Server error during signup'
    });
  }
});

// ==================== LOGIN ROUTE ====================
// POST /api/auth/login
// User logs in with email and password
router.post('/login', async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email in database
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Compare entered password with stored hashed password
    // bcrypt.compare(enteredPassword, storedHashedPassword)
    // Returns true if they match, false if they don't
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password doesn't match, reject login
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Password is correct! Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error during login'
    });
  }
});

// Export router so server.js can use it
module.exports = router;