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

// Route permissions
export const ROUTE_PERMISSIONS = {
  // Student routes - only accessible by School role
  STUDENT_GAMES_ROADMAP: [ROLES.SCHOOL],
  STUDENT_QUIZ_HUNTERS: [ROLES.SCHOOL],
  STUDENT_CODE_CRUSHERS: [ROLES.SCHOOL],
  STUDENT_CIRCUIT_SMASHERS: [ROLES.SCHOOL],
  STUDENT_ROUTE_SEEKERS: [ROLES.SCHOOL],
  STUDENT_BATTLE_BREAKERS: [ROLES.SCHOOL],
  STUDENT_WINNERS: [ROLES.SCHOOL],

  // Admin routes - only accessible by Admin role
  ADMIN_DASHBOARD: [ROLES.ADMIN],
  ADMIN_MARKING_CRITERIAS: [ROLES.ADMIN],
  ADMIN_QUIZ_HUNTERS: [ROLES.ADMIN],
  ADMIN_CODE_CRUSHERS: [ROLES.ADMIN],
  ADMIN_CIRCUIT_SMASHERS: [ROLES.ADMIN],
  ADMIN_ROUTE_SEEKERS: [ROLES.ADMIN],
  ADMIN_BATTLE_BREAKERS: [ROLES.ADMIN],
  ADMIN_USER_MANAGEMENT: [ROLES.ADMIN],
  ADMIN_BATTLE_BREAKERS_DASHBOARD: [ROLES.ADMIN],

  // Judge routes - accessible by Judge and Admin roles
  JUDGE_DASHBOARD: [ROLES.JUDGE, ROLES.ADMIN],
  JUDGE_MARKING: [ROLES.JUDGE, ROLES.ADMIN],
};

// Check if user has permission to access a route
export const canAccessRoute = (userRole, routePermission) => {
  if (!userRole || !routePermission) return false;
  return routePermission.includes(userRole);
};

// Get default route based on user role
export const getDefaultRoute = (userRole) => {
  switch (userRole) {
    case ROLES.SCHOOL:
      return '/student/games-roadmap';
    case ROLES.JUDGE:
      return '/judge/dashboard';
    case ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/';
  }
};

// Get unauthorized redirect route
export const getUnauthorizedRoute = (userRole) => {
  return getDefaultRoute(userRole);
};
