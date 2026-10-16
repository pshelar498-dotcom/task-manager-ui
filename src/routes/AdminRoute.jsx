import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Admin only (like the backend's authorize("admin") middleware)
export default function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
