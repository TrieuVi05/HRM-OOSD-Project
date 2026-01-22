import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "./AdminLayout.jsx";
import ManagerLayout from "./ManagerLayout.jsx";
import EmployeeLayout from "./EmployeeLayout.jsx";

export default function RoleLayout() {
  const { role } = useAuth();

  if (role === "HR_ADMIN") return <AdminLayout />;
  if (role === "MANAGER") return <ManagerLayout />;
  return <EmployeeLayout />;
}
