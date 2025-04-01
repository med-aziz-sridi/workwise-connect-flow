
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
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  providerId: string;
  providerName: string;
  createdAt: string;
  status: 'open' | 'closed' | 'completed';
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
  status: 'pending' | 'accepted' | 'rejected';
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
  type: 'application' | 'message' | 'system';
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
