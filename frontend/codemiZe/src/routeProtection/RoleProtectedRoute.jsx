import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessRoute, getUnauthorizedRoute } from '../utils/roleConstants';

export function RoleProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user data is missing, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has permission to access this route
  if (!canAccessRoute(user.role, allowedRoles)) {
    console.log(`Access denied: User role ${user.role} not allowed for this route. Allowed roles: ${allowedRoles.join(', ')}`);
    // Redirect to appropriate route based on user role
    const redirectRoute = getUnauthorizedRoute(user.role);
    return <Navigate to={redirectRoute} replace />;
  }

  return children;
}

// Legacy ProtectedRoute for backward compatibility
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
