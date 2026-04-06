import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

/* ── Lazy-loaded pages ─────────────────────────────── */
const Landing = lazy(() => import("../pages/public/Landing"));
const Login = lazy(() => import("../pages/public/Login"));

const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout"));
const DevDashboardLayout = lazy(() => import("../components/layout/DevDashboardLayout"));

const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const DevDashboardHome = lazy(() => import("../pages/dashboard/DevDashboardHome"));
const SchoolsManagement = lazy(() => import("../pages/dashboard/SchoolsManagement"));
const ProductsManagement = lazy(() => import("../pages/dashboard/ProductsManagement"));
const SubscriptionsManagement = lazy(() => import("../pages/dashboard/SubscriptionsManagement"));
const UserManagement = lazy(() => import("../pages/dashboard/UserManagement"));
const SubscriptionManagement = lazy(() => import("../pages/dashboard/SubscriptionManagement"));
const ProductMonitoring = lazy(() => import("../pages/dashboard/ProductMonitoring"));
const ProfileSettings = lazy(() => import("../pages/dashboard/ProfileSettings"));
const PaymentHistory = lazy(() => import("../pages/dashboard/PaymentHistory"));
const FeedbackPage = lazy(() => import("../pages/dashboard/FeedbackPage"));
const StudentListPage = lazy(() => import("../pages/dashboard/StudentListPage"));

/* ── Suspense fallback ─────────────────────────────── */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-950">
    <div className="w-8 h-8 border-4 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dev/dashboard"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <DevDashboardHome />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/schools"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <SchoolsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/subscriptions"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <SubscriptionsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/products"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <ProductsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/payments"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <PaymentHistory />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/settings"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <ProfileSettings />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/feedback"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <FeedbackPage />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/students"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <DevDashboardLayout>
                <StudentListPage />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <DashboardLayout>
                <SubscriptionManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <DashboardLayout>
                <ProductMonitoring />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <DashboardLayout>
                <PaymentHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <DashboardLayout>
                <ProfileSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <DashboardLayout>
                <ProfileSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <DashboardLayout>
                <FeedbackPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
