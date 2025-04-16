
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types';
import { getConversations } from '@/services/messaging';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface ProjectChat {
  id: string;
  title: string;
  lastMessageAt: string;
  participantCount: number;
}

// Update the Conversation type to include has_contract
declare module '@/types' {
  interface Conversation {
    has_contract?: boolean;
  }
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projectChats, setProjectChats] = useState<ProjectChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Fetch private conversations
        const data = await getConversations(user.id);
        setConversations(data);
        
        // Fetch projects the user is part of
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, created_at')
          .eq('freelancer_id', user.id)
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          console.error('Error fetching freelancer projects:', projectsError);
          return;
        }
        
        // Also fetch projects where user is the provider
        const { data: providerProjectsData, error: providerProjectsError } = await supabase
          .from('jobs')
          .select('id, title, created_at')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false });
          
        if (providerProjectsError) {
          console.error('Error fetching provider projects:', providerProjectsError);
        }
        
        // Combine the projects
        const allProjects = [
          ...(projectsData || []),
          ...(providerProjectsData || [])
        ];
        
        // For each project, separately fetch its messages
        if (allProjects.length > 0) {
          const formattedProjects: ProjectChat[] = [];
          
          for (const project of allProjects) {
            const { data: messagesData, error: messagesError } = await supabase
              .from('project_messages')
              .select('created_at')
              .eq('project_id', project.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (messagesError) {
              console.error(`Error fetching messages for project ${project.id}:`, messagesError);
              continue;
            }
            
            const lastMessageAt = messagesData && messagesData.length > 0
              ? new Date(messagesData[0].created_at).toISOString()
              : new Date(project.created_at).toISOString();
            
            // Get participant count
            const { count: participantCount, error: countError } = await supabase
              .from('project_messages')
              .select('sender_id', { count: 'exact', head: true })
              .eq('project_id', project.id)
              .limit(1);
              
            if (countError) {
              console.error(`Error counting participants for project ${project.id}:`, countError);
            }
            
            formattedProjects.push({
              id: project.id,
              title: project.title,
              lastMessageAt,
              participantCount: participantCount || 2 // Default to 2 if count fails
            });
          }
          
          setProjectChats(formattedProjects);
        } else {
          setProjectChats([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Helper function to get initials from a name
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with freelancers and clients</p>
        </div>

        <Tabs defaultValue="private" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="private" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Private Messages
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Project Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="private">
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle>Private Conversations</CardTitle>
                <CardDescription>One-on-one messages with freelancers and clients</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {conversations.length > 0 ? (
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <Link
                        key={conversation.id}
                        to={`/messages/${conversation.id}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.otherUser?.profilePicture} alt={conversation.otherUser?.name} />
                            <AvatarFallback>{conversation.otherUser?.name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{conversation.otherUser?.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                            </p>
                          </div>
                          {conversation.has_contract && (
                            <Badge className="bg-green-100 text-green-800">Contract</Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No messages yet</h3>
                    <p className="mt-1 text-gray-500">When you connect with freelancers or clients, your conversations will appear here.</p>
                    <Button asChild className="mt-6">
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="groups">
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle>Project Group Chats</CardTitle>
                <CardDescription>Group conversations for projects</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {projectChats.length > 0 ? (
                  <div className="divide-y">
                    {projectChats.map((project) => (
                      <Link
                        key={project.id}
                        to={`/project/${project.id}/chat`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{project.title}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{formatDistanceToNow(new Date(project.lastMessageAt), { addSuffix: true })}</span>
                              <span className="mx-2">•</span>
                              <span>{project.participantCount} participants</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No project chats</h3>
                    <p className="mt-1 text-gray-500">When you're assigned to projects, group chats will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;
