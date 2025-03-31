
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface RoleRouteProps {
  children: React.ReactNode;
  role: UserRole;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'freelancer' ? '/freelancer/dashboard' : '/provider/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
