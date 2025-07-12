// Role constants for consistent usage across the application
export const ROLES = {
  SCHOOL: 'School',
  JUDGE: 'Judge', 
  ADMIN: 'Admin'
};

// Role hierarchy levels
export const ROLE_LEVELS = {
  [ROLES.SCHOOL]: 1,
  [ROLES.JUDGE]: 2,
  [ROLES.ADMIN]: 3
};

// Helper functions
export const getRoleLevel = (role) => ROLE_LEVELS[role] || 0;

export const hasPermission = (userRole, requiredRole) => {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
};

export const isAdmin = (role) => role === ROLES.ADMIN;
export const isJudge = (role) => role === ROLES.JUDGE;
export const isSchool = (role) => role === ROLES.SCHOOL;
