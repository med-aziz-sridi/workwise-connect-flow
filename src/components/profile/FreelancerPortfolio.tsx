
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
    return (
      <div className="p-6 border-t">
        <h2 className="text-lg font-semibold mb-4">Portfolio Projects</h2>
        <p>Loading projects...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 border-t">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Portfolio Projects</h2>
        <Button asChild size="sm">
          <Link to="/freelancer/add-project" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add Project
          </Link>
        </Button>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={() => handleDelete(project.id)}
              showActions
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4 text-center">
              You haven't added any portfolio projects yet.
            </p>
            <Button asChild>
              <Link to="/freelancer/add-project" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Add Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreelancerPortfolio;
