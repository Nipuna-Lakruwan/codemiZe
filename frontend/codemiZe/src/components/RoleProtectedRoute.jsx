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

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has permission to access this route
  if (!canAccessRoute(user.role, allowedRoles)) {
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
