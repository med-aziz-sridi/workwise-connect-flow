
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

// Sign Up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (authError) throw authError;

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        name,
        role,
        created_at: new Date().toISOString()
      });

      if (profileError) throw profileError;
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Sign In
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile
      },
      session: data.session
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Sign Out
export const signOut = async (req: Request, res: Response) => {
  try {
    await supabase.auth.signOut();
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ error: 'Error signing out' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      ...profile
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Error getting current user' });
  }
};
