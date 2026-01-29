import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const normalizedRole = role ? String(role).toUpperCase().trim() : null;
    const allowed = allowedRoles.map((r) => String(r).toUpperCase().trim());
    if (!allowed.includes(normalizedRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
