
import React from 'react';
import { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const { title, description, images } = project;
  
  return (
    <Card className="overflow-hidden group h-full relative">
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
        
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        
        {images.length > 1 && (
          <div className="flex mt-3 gap-2 overflow-x-auto">
            {images.slice(1).map((image, index) => (
              <div key={index} className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                <img src={image} alt={`${title} ${index + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
