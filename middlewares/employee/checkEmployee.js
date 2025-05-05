const checkEmployee = (req, res, next) => {
  const user = req.user;
  console.log('User from JWT in Employee Role Middleware:', user);

  if (!user || user.role !== "employee") {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Access denied: Employee role required.',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

module.exports = checkEmployee;