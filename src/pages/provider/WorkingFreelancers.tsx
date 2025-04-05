
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Briefcase, MessageSquare, Search, User, Users } from 'lucide-react';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { User as UserType } from '@/types';

const WorkingFreelancers: React.FC = () => {
  const { user } = useAuth();
  const { applications, jobs, users = [] } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // This ensures users are loaded
    if (users.length === 0) {
      console.log('No users loaded yet');
    }
  }, [users]);
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can view this page" 
      />
    );
  }
  
  // Get all accepted applications for this provider's jobs
  const myJobs = jobs.filter(job => job.providerId === user.id);
  const myJobIds = myJobs.map(job => job.id);
  
  const acceptedApplications = applications.filter(app => 
    myJobIds.includes(app.jobId) && app.status === 'accepted'
  );
  
  // Group freelancers by job
  const freelancersByJob = myJobs.map(job => {
    const jobApplications = acceptedApplications.filter(app => app.jobId === job.id);
    const jobFreelancers = jobApplications.map(app => {
      // Check if users array exists and then find the freelancer
      const freelancer = users && users.length > 0 
        ? users.find(u => u.id === app.freelancerId) 
        : undefined;
      
      return {
        applicationId: app.id,
        freelancer: freelancer || { 
          id: app.freelancerId,
          name: 'Unknown Freelancer',
          profilePicture: '',
          email: '',
          role: 'freelancer',
          createdAt: ''
        } as UserType
      };
    });
    
    return {
      job,
      freelancers: jobFreelancers
    };
  }).filter(item => item.freelancers.length > 0);
  
  // Filter by search term
  const filteredFreelancersByJob = freelancersByJob.filter(item => {
    const jobMatch = item.job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const freelancerMatch = item.freelancers.some(f => 
      f.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return jobMatch || freelancerMatch;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/provider/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Freelancers Working With Me</h1>
            <p className="text-gray-600 mt-2">Manage your team of freelancers across different projects</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs or freelancers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      {filteredFreelancersByJob.length > 0 ? (
        <div className="space-y-8">
          {filteredFreelancersByJob.map(({ job, freelancers }) => (
            <Card key={job.id} className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <CardTitle className="text-xl">
                    <span className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      {job.title}
                    </span>
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 self-start sm:self-auto">
                    {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {freelancers.map(({ applicationId, freelancer }) => (
                    <div key={applicationId} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={freelancer.profilePicture} />
                          <AvatarFallback>
                            {freelancer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{freelancer.name}</h3>
                          <p className="text-sm text-gray-500">Working on {job.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/applicants/${freelancer.id}`}>
                            <User className="h-4 w-4 mr-1" />
                            Profile
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/messages/${freelancer.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No freelancers currently working with you</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? "No matches found for your search. Try adjusting your search terms."
              : "When you hire freelancers, they'll appear here so you can easily manage your team."}
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mx-auto"
            >
              Clear Search
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default WorkingFreelancers;
