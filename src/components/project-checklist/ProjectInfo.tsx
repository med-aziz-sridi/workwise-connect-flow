
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectInfoProps {
  projectId?: string;
  projectTitle?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId, projectTitle }) => {
  if (!projectId) return null;
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{projectTitle || 'Project'}</h1>
        <p className="text-gray-600 mt-1">Project Checklist</p>
      </div>
      <Button asChild variant="outline">
        <Link to={`/project/${projectId}/chat`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Project Chat
        </Link>
      </Button>
    </div>
  );
};

export default ProjectInfo;
