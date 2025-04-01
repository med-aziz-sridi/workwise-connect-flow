
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
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
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
      <p className="text-gray-600">Please wait while we complete your authentication.</p>
    </div>
  );
};

export default AuthCallback;
