import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ArrowLeft, Briefcase, Calendar, Plus, Search, Users } from 'lucide-react';

const MyJobs: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applications } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can view their jobs" 
      />
    );
  }
  
  const providerJobs = jobs.filter(job => job.providerId === user.id);
  const openJobs = providerJobs.filter(job => job.status === 'open');
  const closedJobs = providerJobs.filter(job => job.status === 'closed');
  
  const filteredOpenJobs = openJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredClosedJobs = closedJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getApplicationCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/provider/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-2">Manage your job postings and review applications</p>
          </div>
          
          <Button asChild>
            <Link to="/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>
                You have {providerJobs.length} jobs ({openJobs.length} open)
              </CardDescription>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="open" className="flex gap-2">
                <Briefcase className="h-4 w-4" />
                Open Jobs
                <Badge className="ml-2 bg-blue-100 text-blue-800">{openJobs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex gap-2">
                <Calendar className="h-4 w-4" />
                Closed Jobs
                <Badge className="ml-2 bg-gray-100 text-gray-800">{closedJobs.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="open">
              {filteredOpenJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredOpenJobs.map(job => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <Link to={`/jobs/${job.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                            {job.title}
                          </Link>
                          <div className="flex items-center mt-1 text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            <Users className="h-4 w-4 mr-1" />
                            {getApplicationCount(job.id)} applicants
                          </div>
                          
                          <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded">
                            ${job.budget}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-1 mb-2">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                        <Button asChild size="sm">
                          <Link to={`/jobs/${job.id}/applicants`}>
                            View Applicants
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  {searchTerm ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No matching jobs found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search terms or clear the search
                      </p>
                      <Button onClick={() => setSearchTerm('')} variant="outline">Clear Search</Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No open jobs</h3>
                      <p className="text-gray-600 mb-4">
                        Post your first job to start finding talented freelancers
                      </p>
                      <Button asChild>
                        <Link to="/post-job">
                          <Plus className="h-4 w-4 mr-2" />
                          Post a Job
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed">
              {filteredClosedJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredClosedJobs.map(job => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <Link to={`/jobs/${job.id}`} className="text-lg font-medium text-gray-600 hover:underline">
                            {job.title}
                          </Link>
                          <div className="flex items-center mt-1 text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          Closed
                        </Badge>
                      </div>
                      
                      <p className="text-gray-500 line-clamp-1 mb-2">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50 text-gray-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-1" />
                          {getApplicationCount(job.id)} applications received
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  {searchTerm ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No matching closed jobs found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search terms or clear the search
                      </p>
                      <Button onClick={() => setSearchTerm('')} variant="outline">Clear Search</Button>
                    </>
                  ) : (
                    <h3 className="text-lg font-medium text-gray-900">No closed jobs</h3>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyJobs;
