
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';

const FreelancerPortfolio: React.FC = () => {
  const { projects, isLoading } = useData();

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Portfolio Projects</h2>
        <Button asChild size="sm">
          <Link to="/add-project">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} showActions />
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">You haven't added any portfolio projects yet.</p>
              <Button asChild>
                <Link to="/add-project">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FreelancerPortfolio;
