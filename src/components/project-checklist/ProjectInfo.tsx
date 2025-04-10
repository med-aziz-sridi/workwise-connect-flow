
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckSquare, Layout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface ProjectInfoProps {
  projectId?: string;
  projectTitle?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId, projectTitle }) => {
  const location = useLocation();
  
  if (!projectId) return null;
  
  const isChecklistActive = location.pathname.includes('/checklist');
  const isWhiteboardActive = location.pathname.includes('/whiteboard');
  const isChatActive = location.pathname.includes('/chat');
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{projectTitle || 'Project'}</h1>
          <p className="text-gray-600 mt-1">Project Collaboration</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          asChild 
          variant={isChecklistActive ? "default" : "outline"}
        >
          <Link to={`/project/${projectId}/checklist`}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </Link>
        </Button>
        
        <Button 
          asChild 
          variant={isWhiteboardActive ? "default" : "outline"}
        >
          <Link to={`/project/${projectId}/whiteboard`}>
            <Layout className="h-4 w-4 mr-2" />
            Whiteboard
          </Link>
        </Button>
        
        <Button 
          asChild 
          variant={isChatActive ? "default" : "outline"}
        >
          <Link to={`/project/${projectId}/chat`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectInfo;
