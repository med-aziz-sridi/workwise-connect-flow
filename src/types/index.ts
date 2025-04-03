export type UserRole = 'freelancer' | 'provider';

// Session user information
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
  coverPicture?: string;
  verified?: boolean;
}

// Database profile from Supabase
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_picture?: string;
  cover_picture?: string;
  bio?: string;
  skills?: string[];
  created_at: string;
  verified?: boolean;
}

export type JobStatus = 'open' | 'closed' | 'completed';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type NotificationType = 'application' | 'message' | 'system' | 'job';

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  providerId: string;
  providerName: string;
  createdAt: string;
  status: JobStatus;
  coverImage?: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  skills: string[];
  budget: number;
  coverImage?: string;
}

export interface FreelancerInfo {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface JobInfo {
  id: string;
  title: string;
  providerId: string;
  providerName: string;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: string;
  job?: JobInfo;
  freelancer?: FreelancerInfo;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  freelancerId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
  relatedId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessageAt: string;
  jobId?: string;
  lastMessage?: string;
  otherUser?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  freelancerId: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  freelancerId: string;
}

// New interface for verification requests
export interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  documents?: string[];
}
