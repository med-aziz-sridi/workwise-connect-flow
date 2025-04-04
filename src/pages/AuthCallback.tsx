
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Check if it's an email confirmation flow
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const type = params.get('type');
        
        if (type === 'signup' && !data?.session) {
          // This was likely an email confirmation, redirect to login
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }
        
        if (data?.session) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          // Redirect based on user role
          if (profileData) {
            navigate(profileData.role === 'freelancer' ? '/freelancer/dashboard' : '/provider/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setIsProcessing(false);
        
        // Redirect to login after a delay even if there's an error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {isProcessing ? (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
          <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </>
      ) : error ? (
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {error}
              <p className="mt-2">Redirecting you to the login page...</p>
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <div className="w-full max-w-md">
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Email Verified!</AlertTitle>
              <AlertDescription className="text-green-700">
                <p>Your email has been successfully verified.</p>
                <p className="mt-2">Redirecting you to the login page...</p>
              </AlertDescription>
            </Alert>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthCallback;
