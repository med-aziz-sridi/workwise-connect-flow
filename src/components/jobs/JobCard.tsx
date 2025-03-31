
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { id, title, skills, budget, providerName, createdAt, status, coverImage } = job;
  
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md border border-gray-200 hover:border-blue-200">
      {coverImage && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className={`p-5 ${!coverImage ? 'pt-5' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <Link 
              to={`/jobs/${id}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-gray-600 mt-1">{providerName}</p>
          </div>
          <Badge 
            variant={status === 'open' ? 'default' : 'secondary'} 
            className={status === 'open' ? 'bg-green-500' : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50">
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="outline" className="bg-blue-50">
              +{skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
          <span className="font-medium text-green-600">${budget}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
