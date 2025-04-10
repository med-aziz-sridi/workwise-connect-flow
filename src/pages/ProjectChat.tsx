
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, ListCheck, Send, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ProjectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_profile_picture: string | null;
  content: string;
  created_at: string;
}

// Define the interface for the database response
interface ProjectMessageRecord {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  project_id: string;
  profiles?: {
    name: string;
    profile_picture: string | null;
  };
}

const ProjectChat: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs, applications } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectId || !user) return;
    
    const fetchProjectData = async () => {
      try {
        // Find the job in our existing data
        const foundProject = jobs.find(job => job.id === projectId);
        if (foundProject) {
          setProject(foundProject);
          
          // Get all accepted applications for this project
          const projectApplications = applications.filter(
            app => app.jobId === projectId && app.status === 'accepted'
          );
          
          // Get participant information
          const { data: participantsData, error: participantsError } = await supabase
            .from('profiles')
            .select('id, name, profile_picture')
            .in('id', [foundProject.providerId, ...projectApplications.map(app => app.freelancerId)]);
            
          if (!participantsError && participantsData) {
            setParticipants(participantsData);
          }
          
          // Fetch messages using a raw query since project_messages isn't in the types
          const { data: messagesData, error: messagesError } = await supabase
            .rpc('get_project_messages', { p_project_id: projectId });
            
          if (!messagesError && messagesData) {
            const formattedMessages = messagesData.map((msg: any) => ({
              id: msg.id,
              sender_id: msg.sender_id,
              sender_name: msg.sender_name || 'Unknown User',
              sender_profile_picture: msg.profile_picture || null,
              content: msg.content,
              created_at: msg.created_at
            }));
            
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('project-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${projectId}`,
      }, async (payload) => {
        // Get sender info
        const { data: senderData } = await supabase
          .from('profiles')
          .select('name, profile_picture')
          .eq('id', payload.new.sender_id)
          .single();
          
        const newMsg: ProjectMessage = {
          id: payload.new.id,
          sender_id: payload.new.sender_id,
          sender_name: senderData?.name || 'Unknown User',
          sender_profile_picture: senderData?.profile_picture || null,
          content: payload.new.content,
          created_at: payload.new.created_at
        };
        
        setMessages(prev => [...prev, newMsg]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, jobs, applications]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !projectId) return;
    
    setIsSending(true);
    try {
      // Use RPC to insert project message
      const { error } = await supabase
        .rpc('insert_project_message', {
          p_project_id: projectId,
          p_sender_id: user.id,
          p_content: newMessage.trim()
        });
        
      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
                    <p className="text-gray-600 max-w-sm mt-1">
                      Start the conversation by sending the first message to your project team.
                    </p>
                  </div>
                ) : (
                  messages.map(message => {
                    const isCurrentUser = message.sender_id === user?.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                          <Avatar className="h-8 w-8">
                            {message.sender_profile_picture ? (
                              <AvatarImage src={message.sender_profile_picture} alt={message.sender_name} />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className={`
                              px-4 py-2 rounded-lg 
                              ${isCurrentUser 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'}
                            `}>
                              {!isCurrentUser && (
                                <div className="text-xs font-medium mb-1">
                                  {message.sender_name}
                                </div>
                              )}
                              <p>{message.content}</p>
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t p-3">
                <form 
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSending}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Avatar>
                      {participant.profile_picture ? (
                        <AvatarImage src={participant.profile_picture} alt={participant.name} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-xs text-gray-500">
                        {participant.id === project.providerId ? 'Client' : 'Freelancer'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;
