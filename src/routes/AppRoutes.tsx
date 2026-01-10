import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import SchoolRegistration from "../pages/public/SchoolRegistration";
import CreateAdmin from "../pages/public/CreateAdmin";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import UserManagement from "../pages/dashboard/UserManagement";
import SubscriptionManagement from "../pages/dashboard/SubscriptionManagement";
import ProductMonitoring from "../pages/dashboard/ProductMonitoring";
import ProfileSettings from "../pages/dashboard/ProfileSettings";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to landing */}
        <Route path="/" element={<Landing />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-school" element={<SchoolRegistration />} />
        <Route path="/signup" element={<SchoolRegistration />} />
        <Route path="/create-admin" element={<CreateAdmin />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SubscriptionManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductMonitoring />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfileSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
