
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface AuthRequiredPageProps {
  role?: UserRole;
  message?: string;
}

const AuthRequiredPage: React.FC<AuthRequiredPageProps> = ({ 
  role, 
  message = "You need to be logged in to access this page"
}) => {
  const { user } = useAuth();
  
  const isAuthenticated = !!user;
  const hasCorrectRole = !role || user?.role === role;
  
  let actionText = "Log In";
  let actionLink = "/login";
  let description = message;
  
  if (isAuthenticated && !hasCorrectRole) {
    actionText = "Go to Home";
    actionLink = "/";
    description = message || `This page is only available to ${role}s`;
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <Button asChild>
          <Link to={actionLink}>{actionText}</Link>
        </Button>
      </div>
    </div>
  );
};

export default AuthRequiredPage;
