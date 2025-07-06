import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from Clerk's publicMetadata
  const userRole = user?.publicMetadata?.role as UserRole;
  
  // Check if user has the required role
  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // If no role is set, default to client for backwards compatibility
  if (!userRole && allowedRoles.includes('client')) {
    return <>{children}</>;
  }

  // User doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};
