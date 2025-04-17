
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

// Get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, description, skills, budget, provider_id, profiles:provider_id(name), created_at, status, cover_image, deadline')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('jobs')
      .select('*, profiles:provider_id(id, name, profile_picture)')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Error fetching job' });
  }
};

// Create a new job
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, skills, budget, deadline, cover_image } = req.body;
    const provider_id = req.user?.id; // From auth middleware

    if (!provider_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        skills,
        budget,
        deadline,
        cover_image,
        provider_id,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Error creating job' });
  }
};

// Update a job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id; // From auth middleware

    // Check if user is the provider of the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('provider_id')
      .eq('id', id)
      .single();

    if (jobError) throw jobError;
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.provider_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Error updating job' });
  }
};

// Delete a job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // From auth middleware

    // Check if user is the provider of the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('provider_id')
      .eq('id', id)
      .single();

    if (jobError) throw jobError;
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.provider_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Error deleting job' });
  }
};
