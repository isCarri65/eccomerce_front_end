import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUserProfile } = useUserStore();
  if (!currentUserProfile) return <Navigate to="/login" />;
  if (currentUserProfile.role !== "ADMIN") return <Navigate to="/" />;
  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 