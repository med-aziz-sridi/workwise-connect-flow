
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types';

export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        profiles:participant1_id (id, name, profile_picture),
        profiles2:participant2_id (id, name, profile_picture)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(conv => {
      const isParticipant1 = conv.participant1_id === userId;
      const otherParticipantId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
      const otherParticipant = isParticipant1 ? conv.profiles2 : conv.profiles;
      
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
    // Check if conversation already exists
    const { data: existingConversation, error: queryError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${userId})`)
      .maybeSingle();
    
    if (queryError) throw queryError;
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    // Create new conversation
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

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    // Get participants for permission check
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();
    
    if (convError) throw convError;
    
    // Get messages between these participants
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${conversation.participant1_id},receiver_id.eq.${conversation.participant2_id}),and(sender_id.eq.${conversation.participant2_id},receiver_id.eq.${conversation.participant1_id})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data.map(message => ({
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function sendMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
  try {
    // Create message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();
    
    if (messageError) throw messageError;
    
    // Update conversation's last_message_at timestamp or create new conversation if needed
    await getOrCreateConversation(senderId, receiverId);
    
    // Update existing conversation's timestamp
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .or(`and(participant1_id.eq.${senderId},participant2_id.eq.${receiverId}),and(participant1_id.eq.${receiverId},participant2_id.eq.${senderId})`);
    
    return {
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

export async function markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
  try {
    // Get other participant id
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();
    
    if (convError) throw convError;
    
    const otherParticipantId = conversation.participant1_id === userId ? conversation.participant2_id : conversation.participant1_id;
    
    // Mark messages from the other participant as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherParticipantId)
      .eq('receiver_id', userId)
      .eq('read', false);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}
