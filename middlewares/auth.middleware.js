const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'simple';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract the token - supports 'Bearer <token>' or raw token
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("User Role in AuthMiddleware:", decoded.role);
  
  

    req.user = decoded;

    next();
  } catch (err) {

    console.error("JWT Verification Error:", err.message);

    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;


