import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "supervisor" | "pengawas" | "participant" | "user")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles.length > 0 && userProfile) {
    if (!allowedRoles.includes(userProfile.role)) {
      // Redirect to appropriate dashboard based on role
      switch (userProfile.role) {
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        case "supervisor":
        case "pengawas": // Handle both 'supervisor' and 'pengawas' roles
          return <Navigate to="/supervisor/dashboard" replace />;
        case "participant":
          return <Navigate to="/participant/dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
