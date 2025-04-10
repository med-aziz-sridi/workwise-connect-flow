
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_profile_picture: string | null;
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: ProjectMessage[];
  currentUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <MessageSquare className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
        <p className="text-gray-600 max-w-sm mt-1">
          Start the conversation by sending the first message to your project team.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.sender_id === currentUserId;
        
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
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
