
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types';

export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        profiles1:profiles!conversations_participant1_id_fkey (id, name, profile_picture),
        profiles2:profiles!conversations_participant2_id_fkey (id, name, profile_picture)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(conv => {
      const isParticipant1 = conv.participant1_id === userId;
      const otherParticipantId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
      const otherParticipant = isParticipant1 ? conv.profiles2 : conv.profiles1;
      
      return {
        id: conv.id,
        participant1Id: conv.participant1_id,
        participant2Id: conv.participant2_id,
        lastMessageAt: conv.last_message_at,
        jobId: conv.job_id,
        otherUser: otherParticipant ? {
          id: otherParticipantId,
          name: otherParticipant.name,
          profilePicture: otherParticipant.profile_picture,
        } : undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

export async function getOrCreateConversation(userId: string, otherUserId: string, jobId?: string): Promise<string | null> {
  try {
    const { data: existingConversation, error: queryError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${userId})`)
      .maybeSingle();
    
    if (queryError) throw queryError;
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        participant1_id: userId,
        participant2_id: otherUserId,
        job_id: jobId,
      })
      .select('id')
      .single();
    
    if (insertError) throw insertError;
    
    return newConversation.id;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    return null;
  }
}

// Define the shape of the message data returned from the database
interface MessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  conversation_id: string;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    // Explicitly selecting all needed fields to avoid type inference issues
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content, read, created_at, conversation_id')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Using type assertion to ensure TypeScript knows what type the data is
    return (data as MessageRow[] || []).map((message: MessageRow) => ({
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
      conversationId: message.conversation_id
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  conversationId: string
): Promise<Message | null> {
  try {
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        conversation_id: conversationId
      })
      .select('id, sender_id, receiver_id, content, read, created_at, conversation_id')
      .single();
    
    if (messageError) throw messageError;
    
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return message ? {
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
      conversationId: message.conversation_id
    } : null;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

export async function markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
  try {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)
      .eq('read', false);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}
