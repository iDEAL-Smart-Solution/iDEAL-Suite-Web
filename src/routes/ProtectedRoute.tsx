import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: number[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, token } = useAuth();

  // 🔐 Not authenticated (no real user AND no demo token)
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // 🧪 Demo account: allow access without role checks (both demo tokens)
  if (token === "demo-token" || token === "dev-demo-token") {
    return children;
  }

  // 🔐 Role-based protection (real users only)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
