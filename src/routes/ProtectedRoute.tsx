import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: number[];
}

const getDefaultRouteForRole = (role?: number) => {
  if (role === 4) return "/dev/dashboard";
  if (role === 1 || role === 2 || role === 3) return "/dashboard";
  return "/login";
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, token } = useAuthStore();

  // Require both auth token and a hydrated user so role checks are always possible.
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Enforce route-level role access.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
