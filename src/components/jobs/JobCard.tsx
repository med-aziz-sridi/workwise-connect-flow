
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <Link to={`/jobs/${job.id}`} className="text-xl font-semibold text-blue-700 hover:text-blue-800">
              {job.title}
            </Link>
            <Badge className="bg-green-500 hover:bg-green-600">
              ${job.budget}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500">
            Posted by {job.providerName} • {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          
          <p className="text-gray-700 line-clamp-3 mt-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {job.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t">
        <Link 
          to={`/jobs/${job.id}`} 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Details →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
