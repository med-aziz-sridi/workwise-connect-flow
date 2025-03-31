
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock data for demonstration
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@example.com',
    role: 'freelancer',
    profilePicture: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    bio: 'Full-stack developer with 5 years of experience',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Designer',
    email: 'jane@example.com',
    role: 'freelancer',
    profilePicture: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop',
    bio: 'UI/UX designer passionate about creating intuitive interfaces',
    skills: ['UI/UX', 'Figma', 'Adobe XD', 'Sketch'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Acme Corporation',
    email: 'jobs@acme.com',
    role: 'provider',
    profilePicture: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    bio: 'Leading tech company looking for talented professionals',
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('freeness_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (demo implementation)
      const foundUser = DEMO_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // If role is specified, check if it matches
      if (role && foundUser.role !== role) {
        throw new Error(`Account is not registered as a ${role}`);
      }
      
      // Successful login
      setUser(foundUser);
      localStorage.setItem('freeness_user', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (DEMO_USERS.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        skills: role === 'freelancer' ? [] : undefined,
      };
      
      // In a real app, we would send this to the backend
      // For demo, we'll just set it locally
      setUser(newUser);
      localStorage.setItem('freeness_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Freeness, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('freeness_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('freeness_user', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
