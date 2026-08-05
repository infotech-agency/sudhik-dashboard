import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullPageSpinner } from '@/components/common/Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner label="Authenticating..." />;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
