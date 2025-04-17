
import apiClient from './client';
import { Job, CreateJobInput } from '@/types';

export const getAllJobs = async () => {
  const response = await apiClient.get('/jobs');
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await apiClient.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: CreateJobInput) => {
  const response = await apiClient.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await apiClient.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await apiClient.delete(`/jobs/${id}`);
  return response.data;
};
