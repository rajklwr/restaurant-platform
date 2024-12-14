const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Secret key for signing JWT (make sure it's stored securely)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store it in .env for production

// Middleware function to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers (commonly stored in Authorization header)
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user details to the request object
    req.user = decoded; // Decoded contains user details like _id, name, etc.

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
