
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Profile, User } from '@/types';

export function useProjectsService(user: User | null, profile: Profile | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const query = supabase
        .from('projects')
        .select('*');
      
      if (profile?.role === 'freelancer') {
        query.eq('freelancer_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedProjects = data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        images: project.images || [],
        freelancerId: project.freelancer_id,
        createdAt: project.created_at,
        technologies: project.technologies || [],
        role: project.role || ''
      }));
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'freelancerId'>) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can add projects",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          images: projectData.images,
          freelancer_id: user.id,
          technologies: projectData.technologies,
          role: projectData.role,
        });
      
      if (error) throw error;
      
      toast({
        title: "Project added",
        description: "Your project has been added to your portfolio",
      });
      
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Project addition failed",
        description: "An error occurred while adding your project",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can delete projects",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: projectData, error: checkError } = await supabase
        .from('projects')
        .select('freelancer_id')
        .eq('id', projectId)
        .single();
      
      if (checkError) throw checkError;
      
      if (projectData.freelancer_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own projects",
          variant: "destructive",
        });
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Project deleted",
        description: "Your project has been removed from your portfolio",
      });
      
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Project deletion failed",
        description: "An error occurred while deleting your project",
        variant: "destructive",
      });
    }
  };

  const resetProjects = () => {
    setProjects([]);
  };

  return {
    projects,
    isLoading,
    fetchProjects,
    addProject,
    deleteProject,
    resetProjects
  };
}
