
import React from 'react';
import { format } from 'date-fns';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[70%] rounded-lg px-4 py-2 
        ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}
      `}>
        <p className="break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {format(new Date(message.createdAt), 'h:mm a')}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
