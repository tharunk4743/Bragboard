import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/employee/ProfilePage";
import Settings from "./pages/employee/Settings";
import Marketplace from "./pages/employee/Marketplace";
import ShoutoutDetail from "./pages/employee/ShoutoutDetail";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import Reports from "./pages/admin/Reports";
import Leaderboard from "./pages/employee/LeaderboardPage";
import PageContainer from "./layout/PageContainer";
import { UserRole } from "./data/types";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { authState } = useAuth();

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    authState.user &&
    !allowedRoles.includes(authState.user.role)
  ) {
    return (
      <Navigate
        to={authState.user.role === UserRole.ADMIN ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageContainer />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Employee */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="shoutouts/:id" element={<ShoutoutDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="marketplace" element={<Marketplace />} />

          {/* Admin */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/employees"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/reports"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
