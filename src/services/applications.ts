
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Application, ApplicationStatus, NotificationType, Profile, User } from '@/types';

export function useApplicationsService(user: User | null, profile: Profile | null) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs:job_id (
            *,
            profiles:provider_id (name)
          ),
          profiles:freelancer_id (id, name, profile_picture)
        `);
      
      if (error) throw error;
      
      const formattedApplications: Application[] = data.map(app => ({
        id: app.id,
        jobId: app.job_id,
        freelancerId: app.freelancer_id,
        coverLetter: app.cover_letter,
        status: (app.status as ApplicationStatus) || 'pending',
        createdAt: app.created_at,
        job: app.jobs ? {
          id: app.jobs.id,
          title: app.jobs.title,
          providerId: app.jobs.provider_id,
          providerName: app.jobs.profiles?.name || 'Unknown Provider',
        } : undefined,
        freelancer: app.profiles ? {
          id: app.profiles.id,
          name: app.profiles.name,
          profilePicture: app.profiles.profile_picture,
        } : undefined,
      }));
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyToJob = async (jobId: string, coverLetter: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can apply to jobs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: existingApplications, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id);
      
      if (checkError) throw checkError;
      
      if (existingApplications.length > 0) {
        toast({
          title: "Already applied",
          description: "You have already applied to this job",
          variant: "destructive",
        });
        return;
      }
      
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('title, provider_id')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;
      
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          freelancer_id: user.id,
          cover_letter: coverLetter,
        })
        .select()
        .single();
      
      if (applicationError) throw applicationError;
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: jobData.provider_id,
          message: `${profile.name} has applied to your job: ${jobData.title}`,
          type: 'application',
          related_id: application.id,
        });
      
      if (notificationError) throw notificationError;
      
      toast({
        title: "Application submitted",
        description: "Your job application has been submitted successfully",
      });
      
      fetchApplications();
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Application failed",
        description: "An error occurred while submitting your application",
        variant: "destructive",
      });
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!user || profile?.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can update application status",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs:job_id (title, provider_id)
        `)
        .eq('id', applicationId)
        .single();
      
      if (applicationError) throw applicationError;
      
      if (applicationData.jobs.provider_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only manage applications for your own jobs",
          variant: "destructive",
        });
        return;
      }
      
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);
      
      if (updateError) throw updateError;
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: applicationData.freelancer_id,
          message: `Your application for "${applicationData.jobs.title}" has been ${status}`,
          type: 'application',
          related_id: applicationId,
        });
      
      if (notificationError) throw notificationError;
      
      toast({
        title: "Application updated",
        description: `Application has been ${status}`,
      });
      
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the application",
        variant: "destructive",
      });
    }
  };

  const resetApplications = () => {
    setApplications([]);
  };

  return {
    applications,
    isLoading,
    fetchApplications,
    applyToJob,
    updateApplicationStatus,
    resetApplications
  };
}
