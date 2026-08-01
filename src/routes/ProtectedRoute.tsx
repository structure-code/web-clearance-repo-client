import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();


  if (!isAuthenticated) {
    const isStaffArea = location.pathname.startsWith('/faculty') || location.pathname.startsWith('/admin');
    return <Navigate to={isStaffArea ? '/staff-login' : '/login'} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
