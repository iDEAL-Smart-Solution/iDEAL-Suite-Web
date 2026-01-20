import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import SchoolRegistration from "../pages/public/SchoolRegistration";
import CreateAdmin from "../pages/public/CreateAdmin";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevDashboardLayout from "../components/layout/DevDashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import DevDashboardHome from "../pages/dashboard/DevDashboardHome";
import SchoolsManagement from "../pages/dashboard/SchoolsManagement";
import ProductsManagement from "../pages/dashboard/ProductsManagement";
import SubscriptionsManagement from "../pages/dashboard/SubscriptionsManagement";
import UserManagement from "../pages/dashboard/UserManagement";
import SubscriptionManagement from "../pages/dashboard/SubscriptionManagement";
import ProductMonitoring from "../pages/dashboard/ProductMonitoring";
import ProfileSettings from "../pages/dashboard/ProfileSettings";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-school" element={<SchoolRegistration />} />
        <Route path="/signup" element={<SchoolRegistration />} />
        <Route path="/create-admin" element={<CreateAdmin />} />

        <Route
          path="/dev/dashboard"
          element={
            <ProtectedRoute>
              <DevDashboardLayout>
                <DevDashboardHome />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/schools"
          element={
            <ProtectedRoute>
              <DevDashboardLayout>
                <SchoolsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/subscriptions"
          element={
            <ProtectedRoute>
              <DevDashboardLayout>
                <SubscriptionsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/products"
          element={
            <ProtectedRoute>
              <DevDashboardLayout>
                <ProductsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/settings"
          element={
            <ProtectedRoute>
              <DevDashboardLayout>
                <ProfileSettings />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

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
