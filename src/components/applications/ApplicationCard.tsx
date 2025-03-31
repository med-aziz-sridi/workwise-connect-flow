
import React from 'react';
import { Application, Job } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

interface ApplicationCardProps {
  application: Application;
  job: Job;
  freelancerName?: string;
  freelancerImage?: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  job,
  freelancerName,
  freelancerImage,
}) => {
  const { updateApplicationStatus } = useData();
  const { user } = useAuth();
  
  const isProvider = user?.role === 'provider';
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">
                Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
              </p>
            </div>
            <Badge className={statusColors[application.status]}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          
          {isProvider && freelancerName && (
            <div className="flex items-center space-x-3 my-2">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                {freelancerImage ? (
                  <img 
                    src={freelancerImage} 
                    alt={freelancerName} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                    {freelancerName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{freelancerName}</p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-md border text-gray-700">
            <p className="font-medium text-sm mb-1">Cover Letter:</p>
            <p className="text-sm whitespace-pre-line">{application.coverLetter}</p>
          </div>
        </div>
      </CardContent>
      
      {isProvider && application.status === 'pending' && (
        <CardFooter className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => updateApplicationStatus(application.id, 'rejected')}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-500 border-green-200 hover:bg-green-50"
            onClick={() => updateApplicationStatus(application.id, 'accepted')}
          >
            <Check className="h-4 w-4 mr-1" /> Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ApplicationCard;
