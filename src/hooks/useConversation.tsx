
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/messaging';
import { supabase } from '@/integrations/supabase/client';

interface UseConversationProps {
  conversationId: string;
  userId?: string;
}

interface ConversationParticipant {
  id: string;
  name: string | null;
  profilePicture: string | null;
}

interface UseConversationReturn {
  messages: Message[];
  isSending: boolean;
  isLoading: boolean;
  receiverInfo: ConversationParticipant | null;
  handleSendMessage: (content: string) => Promise<void>;
}

export const useConversation = ({ 
  conversationId, 
  userId 
}: UseConversationProps): UseConversationReturn => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState<ConversationParticipant | null>(null);

  useEffect(() => {
    if (!userId || !conversationId) return;

    const fetchMessagesData = async () => {
      try {
        // Get conversation participants with explicit foreign key references
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select(`
            participant1_id, participant2_id,
            profiles1:profiles!conversations_participant1_id_fkey(id, name, profile_picture),
            profiles2:profiles!conversations_participant2_id_fkey(id, name, profile_picture)
          `)
          .eq('id', conversationId)
          .maybeSingle();
        
        if (convError) {
          console.error('Error fetching conversation:', convError);
          toast({
            title: "Error loading conversation",
            description: "Could not find the conversation. It may have been deleted.",
            variant: "destructive"
          });
          return;
        }
        
        if (!conversation) {
          toast({
            title: "Conversation not found",
            description: "This conversation doesn't exist or you don't have access to it.",
            variant: "destructive"
          });
          return;
        }
        
        // Determine the other participant
        const isParticipant1 = conversation.participant1_id === userId;
        const otherParticipantId = isParticipant1 ? conversation.participant2_id : conversation.participant1_id;
        const otherParticipantData = isParticipant1 ? conversation.profiles2 : conversation.profiles1;
        
        if (otherParticipantData) {
          setReceiverInfo({
            id: otherParticipantId,
            name: otherParticipantData.name || null,
            profilePicture: otherParticipantData.profile_picture || null
          });
        }
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
          
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          throw messagesError;
        }
        
        if (messagesData) {
          setMessages(messagesData.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            content: msg.content,
            read: msg.read,
            createdAt: msg.created_at,
            conversationId: msg.conversation_id
          })));
        }
        
        // Mark messages as read
        await markMessagesAsRead(userId, conversationId);
      } catch (error) {
        console.error('Error fetching conversation data:', error);
        toast({
          title: "Error loading conversation",
          description: "There was a problem loading the messages. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesData();

    // Set up real-time subscription for new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id.eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as any;
        
        setMessages(prev => [...prev, {
          id: newMsg.id,
          senderId: newMsg.sender_id,
          receiverId: newMsg.receiver_id,
          content: newMsg.content,
          read: newMsg.read,
          createdAt: newMsg.created_at,
          conversationId: newMsg.conversation_id
        }]);
        
        // Mark messages as read if we're the receiver
        if (newMsg.sender_id !== userId) {
          markMessagesAsRead(userId, conversationId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [userId, conversationId, toast]);

  const handleSendMessage = async (content: string) => {
    if (!userId || !receiverInfo || !content.trim() || !conversationId) {
      toast({
        title: "Cannot send message",
        description: "Make sure you enter a message and try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    try {
      const sentMessage = await sendMessage(userId, receiverInfo.id, content, conversationId);
      if (!sentMessage) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isSending,
    isLoading,
    receiverInfo,
    handleSendMessage
  };
};
