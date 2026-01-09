import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import RegisterSchool from "../pages/public/RegisterSchool";
import CreateAdmin from "../pages/public/CreateAdmin";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-school" element={<RegisterSchool />} />
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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
