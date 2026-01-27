import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import PublicLayout from "./pages/layouts/PublicLayout.jsx";
import RoleLayout from "./pages/layouts/RoleLayout.jsx";

import HomePage from "./pages/public/HomePage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import UnauthorizedPage from "./pages/public/UnauthorizedPage.jsx";
import RecruitmentLandingPage from "./pages/public/RecruitmentLandingPage.jsx";
import RecruitmentDetailPage from "./pages/public/RecruitmentDetailPage.jsx";
import RecruitmentApplyPage from "./pages/public/RecruitmentApplyPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";

import EmployeesPage from "./pages/shared/EmployeesPage.jsx";
import DepartmentsPage from "./pages/shared/DepartmentsPage.jsx";
import AttendancePage from "./pages/shared/AttendancePage.jsx";
import LeavesPage from "./pages/shared/LeavesPage.jsx";
import PayrollPage from "./pages/shared/PayrollPage.jsx";
import RecruitmentPage from "./pages/shared/RecruitmentPage.jsx";
import UsersRolesPage from "./pages/shared/UsersRolesPage.jsx";
import ContractsPage from "./pages/shared/ContractsPage.jsx";

import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers" element={<RecruitmentLandingPage />} />
        <Route path="/careers/:id" element={<RecruitmentDetailPage />} />
        <Route path="/careers/:id/apply" element={<RecruitmentApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <RoleLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER"]}>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER"]}>
              <DepartmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
              <LeavesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "EMPLOYEE"]}>
              <PayrollPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER"]}>
              <RecruitmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN"]}>
              <ContractsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN"]}>
              <UsersRolesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
