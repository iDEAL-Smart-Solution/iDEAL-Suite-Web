import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import BrandLoader from "../components/ui/BrandLoader";

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
const SchoolAdminsManagement = lazy(() => import("../pages/dashboard/SchoolAdminsManagement"));
const SubscriptionManagement = lazy(() => import("../pages/dashboard/SubscriptionManagement"));
const ProductMonitoring = lazy(() => import("../pages/dashboard/ProductMonitoring"));
const ProfileSettings = lazy(() => import("../pages/dashboard/ProfileSettings"));
const PaymentHistory = lazy(() => import("../pages/dashboard/PaymentHistory"));
const PaymentSuccess = lazy(() => import("../pages/dashboard/PaymentSuccess"));
const PaymentInitialization = lazy(() => import("../pages/dashboard/PaymentInitialization"));
const FeedbackPage = lazy(() => import("../pages/dashboard/FeedbackPage"));
const StudentListPage = lazy(() => import("../pages/dashboard/StudentListPage"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 gap-4">
    <BrandLoader size="lg" />
    <p className="text-slate-400 text-sm">Loading dashboard...</p>
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
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <DevDashboardHome />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/schools"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <SchoolsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/subscriptions"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <SubscriptionsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/products"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <ProductsManagement />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/payments"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <PaymentHistory />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/feedback"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <FeedbackPage />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/students"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <StudentListPage />
              </DevDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dev/school-admins"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <DevDashboardLayout>
                <SchoolAdminsManagement />
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
          path="/payments/success"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <DashboardLayout>
                <PaymentSuccess />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/success."
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <DashboardLayout>
                <PaymentSuccess />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/initialize"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <DashboardLayout>
                <PaymentInitialization />
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
