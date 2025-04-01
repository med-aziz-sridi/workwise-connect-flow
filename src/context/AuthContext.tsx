
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole, User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<Profile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const mapProfileToUser = (profileData: Profile): User => {
    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role,
      profilePicture: profileData.profile_picture,
      bio: profileData.bio,
      skills: profileData.skills || [],
      createdAt: profileData.created_at,
      coverPicture: profileData.cover_picture,
    };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);

        if (currentSession?.user) {
          setIsLoading(true);
          try {
            // Fetch user profile using setTimeout to prevent deadlock
            setTimeout(async () => {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
                setUser(null);
              } else {
                setProfile(profileData as Profile);
                setUser(mapProfileToUser(profileData as Profile));
              }
              setIsLoading(false);
            }, 0);
          } catch (error) {
            console.error('Error in auth state change:', error);
            setIsLoading(false);
          }
        } else {
          setProfile(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);

        if (existingSession?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingSession.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
            setUser(null);
          } else {
            setProfile(profileData as Profile);
            setUser(mapProfileToUser(profileData as Profile));
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (role && data.user) {
        // Check if the user role matches
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData && profileData.role !== role) {
          // Sign out if role doesn't match
          await supabase.auth.signOut();
          throw new Error(`Account is not registered as a ${role}`);
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Login failed",
        description: authError.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Google login failed",
        description: authError.message || "An error occurred during Google login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: `Welcome to Freeness, ${name}!`,
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Registration failed",
        description: authError.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Password reset failed",
        description: authError.message || "An error occurred while sending the reset email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (userData: Partial<Profile>) => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local profile state
      const updatedProfile = { ...profile, ...userData };
      setProfile(updatedProfile);
      setUser(mapProfileToUser(updatedProfile));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isLoading,
      loginWithEmail,
      loginWithGoogle,
      registerWithEmail,
      logout,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
