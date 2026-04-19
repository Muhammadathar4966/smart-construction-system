import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/mockData";

export default function ProtectedRoute({ roles, children }: { roles?: Role[]; children?: ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return <>{children ?? <Outlet />}</>;
}
