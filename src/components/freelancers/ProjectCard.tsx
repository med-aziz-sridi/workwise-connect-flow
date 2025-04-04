
import React, { useState } from 'react';
import { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import ProjectDetailsModal from '@/components/projects/ProjectDetailsModal';

export interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
  showActions?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, showActions = false }) => {
  const { title, description, images, technologies = [] } = project;
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  return (
    <>
      <Card 
        className="overflow-hidden group h-full relative cursor-pointer"
        onClick={() => setIsDetailsModalOpen(true)}
      >
        <div className="relative">
          <div className="h-48 bg-gray-200 overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </div>
          
          {showActions && onDelete && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
          
          {technologies.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {technologies.slice(0, 3).map((tech, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                    {tech}
                  </span>
                ))}
                {technologies.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5">
                    +{technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {images.length > 1 && (
            <div className="flex mt-3 gap-2 overflow-x-auto">
              {images.slice(1, 3).map((image, index) => (
                <div key={index} className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                  <img src={image} alt={`${title} ${index + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {images.length > 3 && (
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border flex items-center justify-center bg-gray-100">
                  <span className="text-sm text-gray-500 font-medium">+{images.length - 3}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProjectDetailsModal
        project={project}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};

export default ProjectCard;
