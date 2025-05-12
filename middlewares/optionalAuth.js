const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'simple';

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
   
    req.user = null;
    return next();
  }

  // Extract token — support 'Bearer <token>' and raw token formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    req.user = null; 
    return next();
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    
    console.warn("OptionalAuth: Invalid token:", err.message);
    req.user = null;
  }

  next(); 
};

module.exports = optionalAuth;