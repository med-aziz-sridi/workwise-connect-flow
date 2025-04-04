
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!project) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{project.title}</DialogTitle>
          <DialogDescription>
            Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>
        
        {project.images && project.images.length > 0 && (
          <div className="mb-4">
            <div className="relative rounded-lg overflow-hidden h-72 mb-3">
              <img 
                src={project.images[0]} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {project.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {project.images.slice(1).map((image, index) => (
                  <div key={index} className="h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${project.title} ${index + 2}`} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-gray-700">{project.description}</p>
          </div>
          
          {project.technologies && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {project.role && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">Role</h3>
                <p className="text-gray-700">{project.role}</p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
