const checkRole = (roles) => {
    return (req, res, next) => {
      // Assuming the user's role is saved in req.user (from JWT or session)
      const userRole = req.user?.role; 
      console.log("User role in check role middleware :", req.user.role);
  
      if (!userRole) {
        return res.status(401).json({ message: "Unauthorized: No role found" });
      }
  
      // Check if user's role is in the allowed roles
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
      }
  
      // Continue to the next middleware or route handler
      next();
    };
  };
  
  module.exports = checkRole;
  