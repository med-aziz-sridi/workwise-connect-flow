
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserSearchResult } from '@/types';

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role, profile_picture, skills, rating, verified, languages')
      .or(`name.ilike.%${query}%, skills.cs.{${query}}`)
      .limit(10);

    if (error) throw error;

    return (data || []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      role: profile.role as UserRole,
      profilePicture: profile.profile_picture,
      skills: profile.skills,
      rating: profile.rating,
      location: profile.location,
      languages: profile.languages,
      verified: profile.verified,
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function getProfileById(profileId: string): Promise<UserSearchResult | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role, profile_picture, skills, rating, verified, languages')
      .eq('id', profileId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      role: data.role as UserRole,
      profilePicture: data.profile_picture,
      skills: data.skills,
      rating: data.rating,
      location: data.location,
      languages: data.languages,
      verified: data.verified,
    };
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    return null;
  }
}
