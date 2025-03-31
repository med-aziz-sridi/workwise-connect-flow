
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Job, Application, Project, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  projects: Project[];
  notifications: Notification[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'providerId' | 'providerName' | 'status'>) => void;
  applyToJob: (jobId: string, coverLetter: string) => void;
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'freelancerId'>) => void;
  deleteProject: (projectId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Sample data
const SAMPLE_JOBS: Job[] = [
  {
    id: 'job1',
    title: 'E-commerce Website Development',
    description: 'We need a skilled developer to build a modern e-commerce website with product catalog, shopping cart, and payment integration.',
    skills: ['React', 'Node.js', 'MongoDB', 'Payment API'],
    budget: 2500,
    providerId: '3',
    providerName: 'Acme Corporation',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
  },
  {
    id: 'job2',
    title: 'Mobile App UI Design',
    description: 'Looking for a talented UI designer to create modern, intuitive interfaces for our iOS and Android food delivery app.',
    skills: ['UI/UX', 'Mobile Design', 'Figma', 'iOS', 'Android'],
    budget: 1800,
    providerId: '3',
    providerName: 'Acme Corporation',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
  },
  {
    id: 'job3',
    title: 'WordPress Blog Customization',
    description: 'We need help customizing our WordPress blog with a custom theme and some specific functionality.',
    skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
    budget: 800,
    providerId: '3',
    providerName: 'Acme Corporation',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
  },
];

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'project1',
    title: 'Finance Dashboard App',
    description: 'A comprehensive finance dashboard with data visualization, user authentication, and real-time updates.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600'],
    freelancerId: '1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project2',
    title: 'E-commerce Mobile App',
    description: 'Native mobile app for an e-commerce platform with features like product browsing, cart management, and secure checkout.',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'],
    freelancerId: '1',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('freeness_jobs');
    const storedApplications = localStorage.getItem('freeness_applications');
    const storedProjects = localStorage.getItem('freeness_projects');
    const storedNotifications = localStorage.getItem('freeness_notifications');
    
    if (storedJobs) setJobs(JSON.parse(storedJobs));
    if (storedApplications) setApplications(JSON.parse(storedApplications));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freeness_jobs', JSON.stringify(jobs));
  }, [jobs]);
  
  useEffect(() => {
    localStorage.setItem('freeness_applications', JSON.stringify(applications));
  }, [applications]);
  
  useEffect(() => {
    localStorage.setItem('freeness_projects', JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem('freeness_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'providerId' | 'providerName' | 'status'>) => {
    if (!user || user.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can create jobs",
        variant: "destructive",
      });
      return;
    }
    
    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...jobData,
      providerId: user.id,
      providerName: user.name,
      createdAt: new Date().toISOString(),
      status: 'open',
    };
    
    setJobs([newJob, ...jobs]);
    
    toast({
      title: "Job created",
      description: "Your job posting has been created successfully",
    });
  };

  const applyToJob = (jobId: string, coverLetter: string) => {
    if (!user || user.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can apply to jobs",
        variant: "destructive",
      });
      return;
    }
    
    // Check if already applied
    if (applications.some(app => app.jobId === jobId && app.freelancerId === user.id)) {
      toast({
        title: "Already applied",
        description: "You have already applied to this job",
        variant: "destructive",
      });
      return;
    }
    
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      jobId,
      freelancerId: user.id,
      coverLetter,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setApplications([newApplication, ...applications]);
    
    // Find job provider to create notification
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newNotification: Notification = {
        id: `notification_${Date.now()}`,
        userId: job.providerId,
        message: `${user.name} has applied to your job: ${job.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'application',
        relatedId: newApplication.id,
      };
      
      setNotifications([newNotification, ...notifications]);
    }
    
    toast({
      title: "Application submitted",
      description: "Your job application has been submitted successfully",
    });
  };

  const updateApplicationStatus = (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!user || user.role !== 'provider') {
      toast({
        title: "Permission denied",
        description: "Only job providers can update application status",
        variant: "destructive",
      });
      return;
    }
    
    const application = applications.find(a => a.id === applicationId);
    if (!application) {
      toast({
        title: "Application not found",
        description: "The requested application does not exist",
        variant: "destructive",
      });
      return;
    }
    
    const job = jobs.find(j => j.id === application.jobId);
    if (!job || job.providerId !== user.id) {
      toast({
        title: "Permission denied",
        description: "You can only manage applications for your own jobs",
        variant: "destructive",
      });
      return;
    }
    
    const updatedApplications = applications.map(a => 
      a.id === applicationId ? { ...a, status } : a
    );
    
    setApplications(updatedApplications);
    
    // Create notification for the freelancer
    const newNotification: Notification = {
      id: `notification_${Date.now()}`,
      userId: application.freelancerId,
      message: `Your application for "${job.title}" has been ${status}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: 'application',
      relatedId: application.id,
    };
    
    setNotifications([newNotification, ...notifications]);
    
    toast({
      title: "Application updated",
      description: `Application has been ${status}`,
    });
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'freelancerId'>) => {
    if (!user || user.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can add projects",
        variant: "destructive",
      });
      return;
    }
    
    const newProject: Project = {
      id: `project_${Date.now()}`,
      ...projectData,
      freelancerId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    setProjects([newProject, ...projects]);
    
    toast({
      title: "Project added",
      description: "Your project has been added to your portfolio",
    });
  };

  const deleteProject = (projectId: string) => {
    if (!user || user.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can delete projects",
        variant: "destructive",
      });
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      toast({
        title: "Project not found",
        description: "The requested project does not exist",
        variant: "destructive",
      });
      return;
    }
    
    if (project.freelancerId !== user.id) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own projects",
        variant: "destructive",
      });
      return;
    }
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    toast({
      title: "Project deleted",
      description: "Your project has been removed from your portfolio",
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (!user) return;
    
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.userId !== user.id) return;
    
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    setNotifications(updatedNotifications);
  };

  return (
    <DataContext.Provider 
      value={{ 
        jobs, 
        applications, 
        projects, 
        notifications,
        createJob,
        applyToJob,
        updateApplicationStatus,
        addProject,
        deleteProject,
        markNotificationAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
