
import React, { createContext, useState, useContext, useEffect } from 'react';
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
  ApplicationStatus
} from '@/types';
import { toast as sonnerToast } from 'sonner';

// Import API services
import * as jobsApi from '@/api/jobs';
// We'll add more imports as we implement the other API services

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
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    jobs: false,
    applications: false,
    projects: false,
    notifications: false,
    experiences: false,
    certifications: false,
    users: false,
  });

  // Jobs methods
  const fetchJobs = async () => {
    setIsLoading(prev => ({ ...prev, jobs: true }));
    try {
      const data = await jobsApi.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Failed to fetch jobs",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const createJob = async (job: Omit<Job, 'id' | 'providerId' | 'providerName' | 'createdAt' | 'status'>) => {
    try {
      await jobsApi.createJob(job);
      fetchJobs();
      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible to freelancers",
        className: "bg-green-100 border-green-500",
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Failed to post job",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const updateJob = async (job: Job) => {
    try {
      await jobsApi.updateJob(job.id, job);
      fetchJobs();
      toast({
        title: "Job updated successfully",
        description: "Your changes have been saved",
        className: "bg-green-100 border-green-500",
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Failed to update job",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await jobsApi.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      toast({
        title: "Job deleted successfully",
        description: "The job has been removed",
        className: "bg-green-100 border-green-500",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Failed to delete job",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Placeholder for other methods (to be implemented as APIs are created)
  const fetchApplications = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchApplications - Not yet implemented with API');
  };

  const fetchProjects = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchProjects - Not yet implemented with API');
  };

  const fetchNotifications = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchNotifications - Not yet implemented with API');
  };

  const fetchExperiences = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchExperiences - Not yet implemented with API');
  };

  const fetchCertifications = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchCertifications - Not yet implemented with API');
  };

  const fetchUsers = async () => {
    // Placeholder - will be implemented with API
    console.log('fetchUsers - Not yet implemented with API');
  };

  // Placeholder implementation for remaining methods
  const applyToJob = async (jobId: string, coverLetter: string) => {
    console.log('applyToJob - Not yet implemented with API');
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    console.log('updateApplicationStatus - Not yet implemented with API');
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'freelancerId'>) => {
    console.log('addProject - Not yet implemented with API');
  };

  const deleteProject = async (projectId: string) => {
    console.log('deleteProject - Not yet implemented with API');
  };

  const markNotificationAsRead = async (notificationId: string) => {
    console.log('markNotificationAsRead - Not yet implemented with API');
  };

  const addExperience = async (experience: Omit<Experience, 'id' | 'freelancerId'>) => {
    console.log('addExperience - Not yet implemented with API');
  };

  const deleteExperience = async (experienceId: string) => {
    console.log('deleteExperience - Not yet implemented with API');
  };

  const addCertification = async (certification: Omit<Certification, 'id' | 'freelancerId'>) => {
    console.log('addCertification - Not yet implemented with API');
  };

  const deleteCertification = async (certificationId: string) => {
    console.log('deleteCertification - Not yet implemented with API');
  };

  // Initialize data when user logs in
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
      // Reset states when user logs out
      fetchJobs(); // Still fetch public jobs
      setApplications([]);
      setProjects([]);
      setNotifications([]);
      setExperiences([]);
      setCertifications([]);
      setUsers([]);
    }
  }, [user]);

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
        refreshJobs: fetchJobs,
        refreshApplications: fetchApplications,
        refreshProjects: fetchProjects,
        refreshNotifications: fetchNotifications,
        refreshExperiences: fetchExperiences,
        refreshCertifications: fetchCertifications,
        refreshUsers: fetchUsers,
        addExperience,
        deleteExperience,
        addCertification,
        deleteCertification
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
