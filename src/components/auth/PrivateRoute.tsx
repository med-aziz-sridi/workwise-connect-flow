
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { User, Profile } from '@/types';

interface PrivateRouteProps {
  children: React.ReactNode | ((user: User, profile: Profile) => React.ReactNode);
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (typeof children === 'function') {
    return <>{children(user, profile)}</>;
  }

  return <>{children}</>;
};

export default PrivateRoute;
