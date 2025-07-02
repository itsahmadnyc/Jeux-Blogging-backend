const checkAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'admin') {
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

