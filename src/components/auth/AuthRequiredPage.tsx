
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';

interface AuthRequiredPageProps {
  role?: UserRole;
  message?: string;
}

const AuthRequiredPage: React.FC<AuthRequiredPageProps> = ({ 
  role,
  message = "You need to be logged in to access this page" 
}) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        <p className="text-gray-600 text-center">Please wait while we verify your access.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-full p-6 mb-6">
        <Lock className="h-12 w-12 text-yellow-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {role 
          ? `This area is only accessible to ${role}s. ${message}`
          : message
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/register">Create Account</Link>
        </Button>
      </div>
      <Button variant="ghost" size="sm" asChild className="mt-6">
        <Link to="/" className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default AuthRequiredPage;
