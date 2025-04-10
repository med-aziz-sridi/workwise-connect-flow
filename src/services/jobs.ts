import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Job, Profile, User, JobStatus, NotificationType, CreateJobInput } from '@/types';

export function useJobsService(user: User | null, profile: Profile | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        description,
        skills,
        budget,
        provider_id,
        profiles:provider_id (name),
        created_at,
        status,
        cover_image,
        number_of_people,
        deadline
      `)
      .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedJobs: Job[] = data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        skills: job.skills || [],
        budget: job.budget,
        providerId: job.provider_id,  
        providerName: job.profiles?.name || 'Unknown Provider',
        createdAt: job.created_at,
        status: (job.status as JobStatus) || 'open',
        coverImage: job.cover_image,
        numberOfPeople: job.number_of_people,
        deadline: job.deadline
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createJob = async (jobData: CreateJobInput) => {
    if (!user || profile?.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can create jobs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          description: jobData.description,
          skills: jobData.skills,
          budget: jobData.budget,
          provider_id: user.id,
          cover_image: jobData.coverImage,
          number_of_people: jobData.numberOfPeople,
          deadline: jobData.deadline
        });
      
      if (error) throw error;
      
      toast({
        title: "Job created",
        description: "Your job posting has been created successfully",
      });
      
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Job creation failed",
        description: "An error occurred while creating your job",
        variant: "destructive",
      });
    }
  };

  const updateJob = async (job: Job) => {
    if (!user || profile?.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can update jobs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: jobData, error: checkError } = await supabase
        .from('jobs')
        .select('provider_id')
        .eq('id', job.id)
        .single();
      
      if (checkError) throw checkError;
      
      if (jobData.provider_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only update your own jobs",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('jobs')
        .update({
          title: job.title,
          description: job.description,
          skills: job.skills,
          budget: job.budget,
          status: job.status,
          cover_image: job.coverImage,
          number_of_people: job.numberOfPeople, 
          deadline: job.deadline
        })
        .eq('id', job.id);
      
      if (error) throw error;
      
      if (job.status === 'closed') {
        const { data: applicants, error: applicantsError } = await supabase
          .from('applications')
          .select('freelancer_id')
          .eq('job_id', job.id);
        
        if (!applicantsError && applicants.length > 0) {
          const notifications = applicants.map(app => ({
            user_id: app.freelancer_id,
            message: `The job "${job.title}" has been closed by the provider.`,
            type: 'job' as NotificationType,
            related_id: job.id,
          }));
          
          await supabase
            .from('notifications')
            .insert(notifications);
        }
      }
      
      toast({
        title: "Job updated",
        description: "Your job has been updated successfully",
      });
      
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Job update failed",
        description: "An error occurred while updating the job",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user || profile?.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can delete jobs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: jobData, error: checkError } = await supabase
        .from('jobs')
        .select('provider_id, title')
        .eq('id', jobId)
        .single();
      
      if (checkError) throw checkError;
      
      if (jobData.provider_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own jobs",
          variant: "destructive",
        });
        return;
      }
      
      const { data: applicants, error: applicantsError } = await supabase
        .from('applications')
        .select('freelancer_id')
        .eq('job_id', jobId);
      
      if (!applicantsError && applicants.length > 0) {
        const notifications = applicants.map(app => ({
          user_id: app.freelancer_id,
          message: `The job "${jobData.title}" has been deleted by the provider.`,
          type: 'job' as NotificationType,
          related_id: jobId,
        }));
        
        await supabase
          .from('notifications')
          .insert(notifications);
      }
      
      await supabase
        .from('applications')
        .delete()
        .eq('job_id', jobId);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: "Job deleted",
        description: "Your job has been deleted successfully",
      });
      
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Job deletion failed",
        description: "An error occurred while deleting the job",
        variant: "destructive",
      });
    }
  };

  return {
    jobs,
    isLoading,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob
  };
}
