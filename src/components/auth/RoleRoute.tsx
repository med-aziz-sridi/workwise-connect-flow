
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface RoleRouteProps {
  role: UserRole;
  children: React.ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ role, children }) => {
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

  if (profile.role !== role) {
    return <Navigate to={profile.role === 'freelancer' ? '/freelancer/dashboard' : '/provider/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
