import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import PublicLayout from "./pages/layouts/PublicLayout.jsx";
import RoleLayout from "./pages/layouts/RoleLayout.jsx";
import ManagerLayout from "./pages/layouts/ManagerLayout.jsx";

import HomePage from "./pages/public/HomePage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import UnauthorizedPage from "./pages/public/UnauthorizedPage.jsx";
import RecruitmentLandingPage from "./pages/public/RecruitmentLandingPage.jsx";
import RecruitmentDetailPage from "./pages/public/RecruitmentDetailPage.jsx";
import RecruitmentApplyPage from "./pages/public/RecruitmentApplyPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import ManagerLeavesReview from "./pages/manager/ManagerLeavesReview.jsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeePayrollPage from "./pages/employee/EmployeePayrollPage.jsx";
import EmployeeLeavesPage from "./pages/employee/EmployeeLeavesPage.jsx";
import EmployeeAttendancePage from "./pages/employee/EmployeeAttendancePage.jsx";

import EmployeesPage from "./pages/shared/EmployeesPage.jsx";
import DepartmentsPage from "./pages/shared/DepartmentsPage.jsx";
import AttendancePage from "./pages/shared/AttendancePage.jsx";
import LeavesPage from "./pages/shared/LeavesPage.jsx";
import PayrollPage from "./pages/shared/PayrollPage.jsx";
import RecruitmentPage from "./pages/shared/RecruitmentPage.jsx";
import UsersRolesPage from "./pages/shared/UsersRolesPage.jsx";
import ContractsPage from "./pages/shared/ContractsPage.jsx";
import WorkSchedulePage from "./pages/shared/WorkSchedulePage.jsx";

import "./App.css";

export default function App() {
  function AttendanceRouteSelector() {
    const { role } = useAuth();
    if (String(role).toUpperCase().trim() === "EMPLOYEE") {
      return <EmployeeAttendancePage />;
    }
    return <AttendancePage />;
  }

  function LeavesRouteSelector() {
    const { role } = useAuth();
    if (String(role).toUpperCase().trim() === "EMPLOYEE") {
      return <EmployeeLeavesPage />;
    }
    return <LeavesPage />;
  }

  function PayrollRouteSelector() {
    const { role } = useAuth();
    if (String(role).toUpperCase().trim() === "EMPLOYEE") {
      return <EmployeePayrollPage />;
    }
    return <PayrollPage />;
  }

  return (
    <Routes>
      {/* ===================== PUBLIC ===================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers" element={<RecruitmentLandingPage />} />
        <Route path="/careers/:id" element={<RecruitmentDetailPage />} />
        <Route path="/careers/:id/apply" element={<RecruitmentApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* ===================== MANAGER (LAYOUT RIÊNG) ===================== */}
      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="leaves" element={<ManagerLeavesReview />} />
        {/* <Route path="attendance" element={<ManagerAttendance />} /> */}
      </Route>

      {/* ===================== PROTECTED (ROLE LAYOUT CHUNG) ===================== */}
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

        {/* Attendance - shared route for all roles (component shows role-specific view) */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
              <AttendanceRouteSelector />
            </ProtectedRoute>
          }
        />

        <Route
          path="/work-schedules"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
              <WorkSchedulePage />
            </ProtectedRoute>
          }
        />


        {/* Leaves - shared route for all roles (selector renders employee or admin view) */}
        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
              <LeavesRouteSelector />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <ProtectedRoute allowedRoles={["HR_ADMIN", "EMPLOYEE"]}>
              <PayrollRouteSelector />
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
          path="/dashboard/manager/attendance"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <AttendancePage />
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
