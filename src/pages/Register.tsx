
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Register: React.FC = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Join Freeness to find work or hire talent
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <RegisterForm />
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
