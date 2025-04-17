
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Profile } from '@/types';
import { signIn, signOut, getCurrentUser } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        if (token) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              profilePicture: userData.profile_picture,
              bio: userData.bio,
              skills: userData.skills,
              createdAt: userData.created_at,
              coverPicture: userData.cover_picture,
              verified: userData.verified,
              availableUntil: userData.available_until,
              rating: userData.rating,
              totalRatings: userData.total_ratings,
            });
            setProfile(userData);
          }
        }
      } catch (error) {
        console.error('Error checking current user:', error);
        // Clear token if it's invalid
        localStorage.removeItem('supabase.auth.token');
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: userData, session } = await signIn({ email, password });
      
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profilePicture: userData.profile_picture,
          bio: userData.bio,
          skills: userData.skills,
          createdAt: userData.created_at,
          coverPicture: userData.cover_picture,
          verified: userData.verified,
          availableUntil: userData.available_until,
          rating: userData.rating,
          totalRatings: userData.total_ratings,
        });
        setProfile(userData);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
