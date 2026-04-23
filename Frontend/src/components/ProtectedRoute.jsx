import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If token missing → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If user role is NOT allowed → redirect to user dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
