import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Application, ApplicationStatus, NotificationType, Profile, User } from '@/types';

export function useApplicationsService(user: User | null, profile: Profile | null) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedApplications = data.map(app => ({
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
          providerName: app.jobs.profiles?.name || 'Unknown',
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
      toast({
        title: "Failed to load applications",
        description: "Please check your internet connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyToJob = async (jobId: string, coverLetter: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only verified freelancers can apply",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplying(true);
    try {
      const { count, error: checkError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id);

      if (checkError) throw checkError;
      
      if (count && count > 0) {
        toast({
          title: "Duplicate application",
          description: "You've already applied to this position",
        });
        return;
      }
      
      const { data: jobData } = await supabase
        .from('jobs')
        .select('title, provider_id')
        .eq('id', jobId)
        .single();

      const { data: application } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          freelancer_id: user.id,
          cover_letter: coverLetter,
          status: 'pending',
        })
        .select()
        .single();

      await supabase
        .from('notifications')
        .insert({
          user_id: jobData?.provider_id,
          message: `New application from ${profile.name}`,
          type: 'application',
          related_id: application.id,
          metadata: {
            jobTitle: jobData?.title,
            status: 'pending'
          }
        });

      toast({
        title: "Application sent!",
        description: "Your proposal has been submitted",
        className: "bg-green-100 border-green-500",
      });
      
      await fetchApplications();
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!user || profile?.role !== 'provider') {
      toast({
        title: "Authorization required",
        description: "Please verify your account",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      const { data: applicationData, error: applicationError } = await supabase
      .from('applications')
      .select(`
        freelancer_id,
        jobs:job_id (
          provider_id
        )
      `)
      .eq('id', applicationId)
      .single();
      if (applicationError) throw applicationError;
      if (applicationData?.jobs?.provider_id !== user.id) {
        toast({
          title: "Permission error",
          description: "You don't own this job listing",
          variant: "destructive",
        });
        return;
      }
      const freelancerId = applicationData.freelancer_id;
      await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      await supabase
        .from('notifications')
        .insert({
          user_id: applicationData.freelancer_id,
          message: `Application ${status}`,
          type: 'status-update',
          related_id: applicationId,
          metadata: { status }
        });

      toast({
        title: `Application ${status}`,
        description: `Successfully ${status} the candidate`,
        className: status === 'accepted' 
          ? "bg-blue-100 border-blue-500" 
          : "bg-orange-100 border-orange-500",
      });

      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update failed",
        description: "Couldn't process your request",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    applications,
    isLoading,
    isApplying,
    isUpdating,
    fetchApplications,
    applyToJob,
    updateApplicationStatus,
    resetApplications: () => setApplications([])
  };
}