
import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { supabase } from '@/integrations/supabase/client';

interface Participant {
  id: string;
  name: string | null;
  profile_picture: string | null;
}

export const useProjectParticipants = (projectId?: string) => {
  const { applications, jobs } = useData();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchParticipants = async () => {
      try {
        // Find the job in our existing data
        const foundProject = jobs.find(job => job.id === projectId);
        if (foundProject) {
          setProject(foundProject);
          
          // Get all accepted applications for this project
          const projectApplications = applications.filter(
            app => app.jobId === projectId && app.status === 'accepted'
          );
          
          // Get participant information
          const { data: participantsData, error: participantsError } = await supabase
            .from('profiles')
            .select('id, name, profile_picture')
            .in('id', [foundProject.providerId, ...projectApplications.map(app => app.freelancerId)]);
            
          if (!participantsError && participantsData) {
            setParticipants(participantsData);
          }
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParticipants();
  }, [projectId, applications, jobs]);
  
  return { 
    participants, 
    project,
    isLoading 
  };
};
