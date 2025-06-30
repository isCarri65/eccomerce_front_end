import { Navigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUserProfile } = useUsers();
  if (!currentUserProfile) return <Navigate to="/login" />;
  if (currentUserProfile.role !== "ADMIN") return <Navigate to="/" />;
  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
