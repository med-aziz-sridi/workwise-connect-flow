import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';
import { toast } from 'sonner';
const FreelancerPortfolio: React.FC = () => {
  const {
    projects,
    isLoading,
    deleteProject
  } = useData();
  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
    }
  };
  if (isLoading.projects) {
    return <div className="p-6 border-t">
        <h2 className="text-lg font-semibold mb-4">Portfolio Projects</h2>
        <p>Loading projects...</p>
      </div>;
  }
  return;
};
export default FreelancerPortfolio;