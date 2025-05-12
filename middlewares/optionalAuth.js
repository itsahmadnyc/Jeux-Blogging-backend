const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'simple';

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    // No token provided, allow anonymous access
    req.user = null;
    return next();
  }

  // Extract token — support 'Bearer <token>' and raw token formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    req.user = null; // Malformed header, treat as anonymous
    return next();
  }

  try {
    // Try to decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("OptionalAuth: User Role:", decoded.role);
    req.user = decoded;
  } catch (err) {
    // Invalid or expired token — allow anonymous access
    console.warn("OptionalAuth: Invalid token:", err.message);
    req.user = null;
  }

  next(); // Continue request
};

module.exports = optionalAuth;