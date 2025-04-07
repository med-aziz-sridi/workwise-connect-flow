
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

export function useUsersService(user: User | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      const formattedUsers: User[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        profilePicture: profile.profile_picture,
        bio: profile.bio,
        skills: profile.skills,
        createdAt: profile.created_at,
        coverPicture: profile.cover_picture,
        verified: profile.verified,
        availableUntil: profile.available_until,
        // Handle fields that may not exist in the database
        location: undefined,
        languages: undefined,
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetUsers = () => {
    setUsers([]);
  };

  return {
    users,
    isLoading,
    fetchUsers,
    resetUsers
  };
}
