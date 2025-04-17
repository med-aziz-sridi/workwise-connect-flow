
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useConversation } from '@/hooks/useConversation';
import MessageList from '@/components/project-chat/MessageList';
import MessageInput from '@/components/project-chat/MessageInput';
import ConversationHeader from '@/components/chat/ConversationHeader';

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const {
    messages,
    isSending,
    isLoading,
    receiverInfo,
    handleSendMessage
  } = useConversation({
    conversationId: conversationId || '',
    userId: user?.id
  });

  // Transform messages to match ProjectMessage format
  const transformedMessages = messages.map(msg => ({
    id: msg.id,
    sender_id: msg.senderId,
    sender_name: msg.senderId === user?.id ? 'You' : (receiverInfo?.name || 'User'),
    sender_profile_picture: msg.senderId === user?.id ? user?.profilePicture : receiverInfo?.profilePicture,
    content: msg.content,
    created_at: msg.createdAt
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-md h-[calc(100vh-140px)]">
          <CardHeader className="border-b py-3 px-4">
            <ConversationHeader 
              receiverName={receiverInfo?.name || null}
              receiverPicture={receiverInfo?.profilePicture || null}
            />
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-76px)]">
            <MessageList 
              messages={transformedMessages} 
              currentUserId={user?.id}
            />
            <MessageInput 
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Conversation;
