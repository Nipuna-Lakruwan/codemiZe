import { ROLES, ROLE_LEVELS } from "../utils/roleConstants.js";

// Middleware to check if user has required role or higher
export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userRole = req.user.role;
      const userLevel = ROLE_LEVELS[userRole];

      if (!userLevel) {
        return res.status(403).json({ message: "Invalid role" });
      }

      // Check if user's role level meets any of the allowed roles
      const hasPermission = allowedRoles.some(role => {
        const requiredLevel = ROLE_LEVELS[role];
        return userLevel >= requiredLevel;
      });

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${userRole}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking permissions", error: error.message });
    }
  };
};

// Check if user has exact role (not hierarchical)
export const requireExactRole = (...exactRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userRole = req.user.role;

      if (!exactRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: `Access denied. Required exact roles: ${exactRoles.join(', ')}. Your role: ${userRole}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking exact role", error: error.message });
    }
  };
};

// Specific role checkers for convenience
export const requireAdmin = requireExactRole(ROLES.ADMIN);
export const requireJudge = requireExactRole(ROLES.JUDGE);
export const requireSchool = requireExactRole(ROLES.SCHOOL);

// Other
export const requireAdminorJudge = requireRole(ROLES.ADMIN, ROLES.JUDGE);

// Middleware to check resource ownership (for schools accessing their own data)
export const requireOwnership = (resourceField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin can access everything
      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      // Judge can access most things
      if (req.user.role === ROLES.JUDGE) {
        return next();
      }

      // Schools can only access their own resources
      if (req.user.role === ROLES.SCHOOL) {
        const resourceUserId = req.params[resourceField] || req.body[resourceField];
        
        if (resourceUserId && resourceUserId !== req.user._id.toString()) {
          return res.status(403).json({ 
            message: "Access denied. You can only access your own resources." 
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking ownership", error: error.message });
    }
  };
};