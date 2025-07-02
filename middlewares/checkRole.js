const checkRole = (roles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; 
  
      if (!userRole) {
        return res.status(401).json({ message: "Unauthorized: No role found" });
      }
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;
  