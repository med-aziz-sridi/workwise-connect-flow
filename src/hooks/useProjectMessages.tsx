
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_profile_picture: string | null;
  content: string;
  created_at: string;
}

export const useProjectMessages = (projectId?: string) => {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  useEffect(() => {
    if (!projectId) return;
    
    const fetchMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('project_messages')
          .select(`
            id, 
            content, 
            created_at, 
            sender_id, 
            profiles(name, profile_picture)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });
          
        if (!messagesError && messagesData) {
          const formattedMessages = messagesData.map(msg => ({
            id: msg.id,
            sender_id: msg.sender_id,
            sender_name: msg.profiles?.name || 'Unknown User',
            sender_profile_picture: msg.profiles?.profile_picture || null,
            content: msg.content,
            created_at: msg.created_at
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
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
  }, [projectId]);
  
  const sendMessage = async (userId: string, content: string) => {
    if (!content.trim() || !userId || !projectId) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          sender_id: userId,
          content: content.trim()
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    messages,
    isLoading,
    isSending,
    sendMessage
  };
};
