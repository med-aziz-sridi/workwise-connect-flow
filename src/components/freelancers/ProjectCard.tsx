
import React from 'react';
import { Project } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const { user } = useAuth();
  const { deleteProject } = useData();
  
  const canManage = user?.id === project.freelancerId;
  
  return (
    <Card>
      <div className="relative aspect-video overflow-hidden">
        {project.images.length > 0 ? (
          <img 
            src={project.images[0]} 
            alt={project.title} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-gray-700 mt-1 line-clamp-3">{project.description}</p>
      </CardContent>
      
      {canManage && (
        <CardFooter className="p-4 bg-gray-50 border-t flex justify-between">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectCard;
