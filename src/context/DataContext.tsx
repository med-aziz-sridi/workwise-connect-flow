
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Job, Application, Project, Notification, CreateJobInput, Profile, Experience, Certification, JobStatus, ApplicationStatus, NotificationType, User, UserRole } from '@/types';
import { toast as sonnerToast } from 'sonner';

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  projects: Project[];
  notifications: Notification[];
  experiences: Experience[];
  certifications: Certification[];
  users: User[];
  isLoading: {
    jobs: boolean;
    applications: boolean;
    projects: boolean;
    notifications: boolean;
    experiences: boolean;
    certifications: boolean;
    users: boolean;
  };
  createJob: (job: CreateJobInput) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string, coverLetter: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'freelancerId'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  refreshJobs: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshExperiences: () => Promise<void>;
  refreshCertifications: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  addExperience: (experience: Omit<Experience, 'id' | 'freelancerId'>) => Promise<void>;
  deleteExperience: (experienceId: string) => Promise<void>;
  addCertification: (certification: Omit<Certification, 'id' | 'freelancerId'>) => Promise<void>;
  deleteCertification: (certificationId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState({
    jobs: false,
    applications: false,
    projects: false,
    notifications: false,
    experiences: false,
    certifications: false,
    users: false,
  });

  const fetchJobs = async () => {
    setIsLoading(prev => ({ ...prev, jobs: true }));
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:provider_id (name)
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
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, applications: true }));
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
      setIsLoading(prev => ({ ...prev, applications: false }));
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, projects: true }));
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
      }));
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, notifications: true }));
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedNotifications: Notification[] = data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        message: notification.message,
        read: notification.read,
        createdAt: notification.created_at,
        type: notification.type as NotificationType,
        relatedId: notification.related_id,
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const fetchExperiences = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, experiences: true }));
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
      setIsLoading(prev => ({ ...prev, experiences: false }));
    }
  };

  const fetchCertifications = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, certifications: true }));
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*');
      
      if (error) throw error;
      
      if (profile?.role === 'freelancer') {
        const filteredData = data.filter(cert => cert.freelancer_id === user.id);
        
        const formattedCertifications: Certification[] = filteredData.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          credentialUrl: cert.credential_url,
          freelancerId: cert.freelancer_id,
        }));
        
        setCertifications(formattedCertifications);
      } else {
        const formattedCertifications: Certification[] = data.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          credentialUrl: cert.credential_url,
          freelancerId: cert.freelancer_id,
        }));
        
        setCertifications(formattedCertifications);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, certifications: false }));
    }
  };

  const fetchUsers = async () => {
    if (!user) return;
    
    setIsLoading(prev => ({ ...prev, users: true }));
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      const formattedUsers: User[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole, // Cast to UserRole type
        profilePicture: profile.profile_picture,
        bio: profile.bio,
        skills: profile.skills,
        createdAt: profile.created_at,
        coverPicture: profile.cover_picture,
        verified: profile.verified,
        availableUntil: profile.available_until,
        location: profile.location || undefined, // Handle potentially missing location
        languages: profile.languages || undefined, // Handle potentially missing languages
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchApplications();
      fetchProjects();
      fetchNotifications();
      fetchExperiences();
      fetchCertifications();
      fetchUsers();
    } else {
      fetchJobs();
      setApplications([]);
      setProjects([]);
      setNotifications([]);
      setExperiences([]);
      setCertifications([]);
      setUsers([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const jobsChannel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs',
      }, () => {
        fetchJobs();
      })
      .subscribe();

    const applicationsChannel = supabase
      .channel('applications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: profile?.role === 'freelancer' 
          ? `freelancer_id=eq.${user.id}` 
          : `job_id=in.(select id from jobs where provider_id=eq.${user.id})`,
      }, () => {
        fetchApplications();
      })
      .subscribe();

    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: profile?.role === 'freelancer' ? `freelancer_id=eq.${user.id}` : undefined,
      }, () => {
        fetchProjects();
      })
      .subscribe();

    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        fetchNotifications();
        
        if (payload.eventType === 'INSERT') {
          sonnerToast.info('New Notification', {
            description: payload.new.message,
          });
        }
      })
      .subscribe();

    const experiencesChannel = supabase
      .channel('experiences-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'experiences',
        filter: profile?.role === 'freelancer' ? `freelancer_id=eq.${user.id}` : undefined,
      }, () => {
        fetchExperiences();
      })
      .subscribe();

    const certificationsChannel = supabase
      .channel('certifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'certifications',
        filter: profile?.role === 'freelancer' ? `freelancer_id=eq.${user.id}` : undefined,
      }, () => {
        fetchCertifications();
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(experiencesChannel);
      supabase.removeChannel(certificationsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [user, profile]);

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

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
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

  const addCertification = async (certificationData: Omit<Certification, 'id' | 'freelancerId'>) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can add certifications",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('certifications')
        .insert({
          name: certificationData.name,
          issuer: certificationData.issuer,
          issue_date: certificationData.issueDate,
          expiry_date: certificationData.expiryDate,
          credential_url: certificationData.credentialUrl,
          freelancer_id: user.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "Certification added",
        description: "Your certification has been added successfully",
      });
      
      fetchCertifications();
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: "Certification addition failed",
        description: "An error occurred while adding your certification",
        variant: "destructive",
      });
    }
  };

  const deleteCertification = async (certificationId: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can delete certifications",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: certificationData, error: checkError } = await supabase
        .from('certifications')
        .select('freelancer_id')
        .eq('id', certificationId)
        .single();
      
      if (checkError) throw checkError;
      
      if (certificationData.freelancer_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own certifications",
          variant: "destructive",
        });
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('certifications')
        .delete()
        .eq('id', certificationId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Certification deleted",
        description: "Your certification has been removed from your profile",
      });
      
      fetchCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast({
        title: "Certification deletion failed",
        description: "An error occurred while deleting your certification",
        variant: "destructive",
      });
    }
  };

  const refreshJobs = fetchJobs;
  const refreshApplications = fetchApplications;
  const refreshProjects = fetchProjects;
  const refreshNotifications = fetchNotifications;
  const refreshExperiences = fetchExperiences;
  const refreshCertifications = fetchCertifications;
  const refreshUsers = fetchUsers;

  return (
    <DataContext.Provider 
      value={{ 
        jobs, 
        applications, 
        projects, 
        notifications,
        experiences,
        certifications,
        users,
        isLoading,
        createJob,
        updateJob,
        deleteJob,
        applyToJob,
        updateApplicationStatus,
        addProject,
        deleteProject,
        markNotificationAsRead,
        refreshJobs,
        refreshApplications,
        refreshProjects,
        refreshNotifications,
        refreshExperiences,
        refreshCertifications,
        refreshUsers,
        addExperience,
        deleteExperience,
        addCertification,
        deleteCertification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
