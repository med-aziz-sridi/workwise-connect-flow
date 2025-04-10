
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Participant {
  id: string;
  name: string | null;
  profile_picture: string | null;
}

interface ParticipantsListProps {
  participants: Participant[];
  providerId?: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, providerId }) => {
  return (
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
                  <AvatarImage src={participant.profile_picture} alt={participant.name || 'User'} />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-medium">{participant.name || 'Unknown User'}</div>
                <div className="text-xs text-gray-500">
                  {participant.id === providerId ? 'Client' : 'Freelancer'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
