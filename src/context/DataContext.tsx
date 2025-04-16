
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Job, 
  Application, 
  Project, 
  Notification, 
  Experience, 
  Certification, 
  User, 
  UserRole,
  ApplicationStatus
} from '@/types';
import { toast as sonnerToast } from 'sonner';

// Import service hooks
import { useJobsService } from '@/services/jobs';
import { useApplicationsService } from '@/services/applications';
import { useProjectsService } from '@/services/projects';
import { useNotificationsService } from '@/services/notifications';
import { useExperiencesService } from '@/services/experiences';
import { useCertificationsService } from '@/services/certifications';
import { useUsersService } from '@/services/users';

// Define context type
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
  createJob: (job: Omit<Job, 'id' | 'providerId' | 'providerName' | 'createdAt' | 'status'>) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string, coverLetter: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
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
  
  // Initialize all services
  const jobsService = useJobsService(user, profile);
  const applicationsService = useApplicationsService(user, profile);
  const projectsService = useProjectsService(user, profile);
  const notificationsService = useNotificationsService(user, profile);
  const experiencesService = useExperiencesService(user, profile);
  const certificationsService = useCertificationsService(user, profile);
  const usersService = useUsersService(user);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const jobsChannel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs',
      }, () => {
        jobsService.fetchJobs();
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
        applicationsService.fetchApplications();
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
        projectsService.fetchProjects();
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
        notificationsService.fetchNotifications();
        
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
        experiencesService.fetchExperiences();
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
        certificationsService.fetchCertifications();
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
      }, () => {
        usersService.fetchUsers();
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

  // Initial data fetch
  useEffect(() => {
    if (user) {
      jobsService.fetchJobs();
      applicationsService.fetchApplications();
      projectsService.fetchProjects();
      notificationsService.fetchNotifications();
      experiencesService.fetchExperiences();
      certificationsService.fetchCertifications();
      usersService.fetchUsers();
    } else {
      jobsService.fetchJobs();
      applicationsService.resetApplications();
      projectsService.resetProjects();
      notificationsService.resetNotifications();
      experiencesService.resetExperiences();
      certificationsService.resetCertifications();
      usersService.resetUsers();
    }
  }, [user]);

  return (
    <DataContext.Provider 
      value={{ 
        jobs: jobsService.jobs, 
        applications: applicationsService.applications, 
        projects: projectsService.projects, 
        notifications: notificationsService.notifications,
        experiences: experiencesService.experiences,
        certifications: certificationsService.certifications,
        users: usersService.users,
        isLoading: {
          jobs: jobsService.isLoading,
          applications: applicationsService.isLoading,
          projects: projectsService.isLoading,
          notifications: notificationsService.isLoading,
          experiences: experiencesService.isLoading,
          certifications: certificationsService.isLoading,
          users: usersService.isLoading,
        },
        createJob: jobsService.createJob,
        updateJob: jobsService.updateJob,
        deleteJob: jobsService.deleteJob,
        applyToJob: applicationsService.applyToJob,
        updateApplicationStatus: applicationsService.updateApplicationStatus,
        addProject: projectsService.addProject,
        deleteProject: projectsService.deleteProject,
        markNotificationAsRead: notificationsService.markNotificationAsRead,
        refreshJobs: jobsService.fetchJobs,
        refreshApplications: applicationsService.fetchApplications,
        refreshProjects: projectsService.fetchProjects,
        refreshNotifications: notificationsService.fetchNotifications,
        refreshExperiences: experiencesService.fetchExperiences,
        refreshCertifications: certificationsService.fetchCertifications,
        refreshUsers: usersService.fetchUsers,
        addExperience: experiencesService.addExperience,
        deleteExperience: experiencesService.deleteExperience,
        addCertification: certificationsService.addCertification,
        deleteCertification: certificationsService.deleteCertification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
