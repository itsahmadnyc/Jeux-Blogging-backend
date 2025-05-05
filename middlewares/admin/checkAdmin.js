const checkAdmin = (req, res, next) => {
  const user = req.user;
  console.log('User from JWT in checkAdmin Middleware is:', user);

  if (!user || user.role !== 'employee') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Access denied: Admin role required...',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

module.exports = checkAdmin;

