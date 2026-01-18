// Import jsonwebtoken to verify tokens
const jwt = require('jsonwebtoken');

// Middleware to protect routes
// This function checks if user has a valid JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    // Token is sent as: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        error: 'No token provided. Please login first.'
      });
    }

    // Extract token from "Bearer <token>"
    // authHeader looks like: "Bearer eyJhbGciOiJIUzI1NiIs..."
    // We need only the token part: "eyJhbGciOiJIUzI1NiIs..."
    const token = authHeader.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        error: 'Invalid token format. Use: Bearer <token>'
      });
    }

    // Verify the token
    // jwt.verify checks:
    // 1. Is the signature valid? (wasn't tampered with)
    // 2. Has it expired?
    // 3. Extract the user data from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    // This way, the route handler can access req.user
    req.user = decoded;

    // Continue to the next middleware/route handler
    next();

  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token. Please login again.'
      });
    }

    res.status(401).json({
      error: 'Authentication failed'
    });
  }
};

// Export the middleware
module.exports = authMiddleware;