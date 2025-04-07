
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConversationHeaderProps {
  receiverName: string | null;
  receiverPicture: string | null;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  receiverName, 
  receiverPicture 
}) => {
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/messages" className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Messages
        </Link>
      </Button>
      
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={receiverPicture || undefined} alt={receiverName || 'User'} />
          <AvatarFallback>{getInitials(receiverName)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg">{receiverName || 'User'}</CardTitle>
      </div>
    </>
  );
};

export default ConversationHeader;
