import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/common/Spinner";

// Login and register pages: a logged-in user goes straight to the dashboard
export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
