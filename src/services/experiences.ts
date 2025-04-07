
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Experience, Profile, User } from '@/types';

export function useExperiencesService(user: User | null, profile: Profile | null) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*');
      
      if (error) throw error;
      
      if (profile?.role === 'freelancer') {
        const filteredData = data.filter(exp => exp.freelancer_id === user.id);
        
        const formattedExperiences: Experience[] = filteredData.map(exp => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          description: exp.description,
          startDate: exp.start_date,
          endDate: exp.end_date,
          current: exp.current,
          freelancerId: exp.freelancer_id,
        }));
        
        setExperiences(formattedExperiences);
      } else {
        const formattedExperiences: Experience[] = data.map(exp => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          description: exp.description,
          startDate: exp.start_date,
          endDate: exp.end_date,
          current: exp.current,
          freelancerId: exp.freelancer_id,
        }));
        
        setExperiences(formattedExperiences);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = async (experienceData: Omit<Experience, 'id' | 'freelancerId'>) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can add experiences",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('experiences')
        .insert({
          title: experienceData.title,
          company: experienceData.company,
          description: experienceData.description,
          start_date: experienceData.startDate,
          end_date: experienceData.endDate,
          current: experienceData.current,
          freelancer_id: user.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "Experience added",
        description: "Your experience has been added successfully",
      });
      
      fetchExperiences();
    } catch (error) {
      console.error('Error adding experience:', error);
      toast({
        title: "Experience addition failed",
        description: "An error occurred while adding your experience",
        variant: "destructive",
      });
    }
  };

  const deleteExperience = async (experienceId: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can delete experiences",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: experienceData, error: checkError } = await supabase
        .from('experiences')
        .select('freelancer_id')
        .eq('id', experienceId)
        .single();
      
      if (checkError) throw checkError;
      
      if (experienceData.freelancer_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own experiences",
          variant: "destructive",
        });
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Experience deleted",
        description: "Your experience has been removed from your profile",
      });
      
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Experience deletion failed",
        description: "An error occurred while deleting your experience",
        variant: "destructive",
      });
    }
  };

  const resetExperiences = () => {
    setExperiences([]);
  };

  return {
    experiences,
    isLoading,
    fetchExperiences,
    addExperience,
    deleteExperience,
    resetExperiences
  };
}
