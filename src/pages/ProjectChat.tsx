
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ListCheck, MessageSquare } from 'lucide-react';
import MessageList from '@/components/project-chat/MessageList';
import MessageInput from '@/components/project-chat/MessageInput';
import ParticipantsList from '@/components/project-chat/ParticipantsList';
import { useProjectMessages } from '@/hooks/useProjectMessages';
import { useProjectParticipants } from '@/hooks/useProjectParticipants';

const ProjectChat: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { messages, isLoading: messagesLoading, isSending, sendMessage } = useProjectMessages(projectId);
  const { participants, project, isLoading: participantsLoading } = useProjectParticipants(projectId);
  
  const isLoading = messagesLoading || participantsLoading;

  const handleSendMessage = async (content: string) => {
    if (!user || !projectId) return;
    await sendMessage(user.id, content);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-gray-600 mt-1">Project Chat</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/project/${projectId}/checklist`}>
            <ListCheck className="h-4 w-4 mr-2" />
            Project Checklist
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[calc(80vh-150px)] flex flex-col">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-lg">Group Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <MessageList messages={messages} currentUserId={user?.id} />
              <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <ParticipantsList participants={participants} providerId={project.providerId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;
