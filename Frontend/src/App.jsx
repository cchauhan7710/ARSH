import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TechDashboard from "./pages/TechDashboard";
import HeadAdminDashboard from "./pages/HeadAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";



export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee", "technician", "admin", "headadmin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "headadmin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Technician Dashboard */}
      <Route
        path="/tech-dashboard"
        element={
          <ProtectedRoute allowedRoles={["technician", "admin", "headadmin"]}>
            <TechDashboard />
          </ProtectedRoute>
        }
      />

      {/* Head Admin Dashboard */}
      <Route
        path="/headadmin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["headadmin"]}>
            <HeadAdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
