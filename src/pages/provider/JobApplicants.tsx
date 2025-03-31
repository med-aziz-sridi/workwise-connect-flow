
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle, User } from 'lucide-react';

const JobApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, applications, updateApplicationStatus } = useData();
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can view applicants" 
      />
    );
  }
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/my-jobs">Back to My Jobs</Link>
        </Button>
      </div>
    );
  }
  
  if (job.providerId !== user.id) {
    navigate('/my-jobs');
    return null;
  }
  
  const jobApplications = applications.filter(app => app.jobId === job.id);
  const pendingApplications = jobApplications.filter(app => app.status === 'pending');
  const acceptedApplications = jobApplications.filter(app => app.status === 'accepted');
  const rejectedApplications = jobApplications.filter(app => app.status === 'rejected');
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/my-jobs" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Jobs
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          <Badge className="ml-4">{job.status}</Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            {jobApplications.length} candidates have applied to this job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex gap-2">
                <Clock className="h-4 w-4" />
                Pending
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">{pendingApplications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex gap-2">
                <CheckCircle className="h-4 w-4" />
                Accepted
                <Badge className="ml-2 bg-green-100 text-green-800">{acceptedApplications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex gap-2">
                <XCircle className="h-4 w-4" />
                Rejected
                <Badge className="ml-2 bg-red-100 text-red-800">{rejectedApplications.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingApplications.length > 0 ? (
                <div className="space-y-6">
                  {pendingApplications.map((application) => {
                    const freelancer = application.freelancerId;
                    return (
                      <div key={application.id} className="border rounded-lg overflow-hidden">
                        <div className="border-b px-4 py-3 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <div className="font-medium">Freelancer #{freelancer.substring(0, 8)}</div>
                              <div className="text-sm text-gray-500">
                                Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                          
                          <Link to={`/applicants/${application.freelancerId}`} className="text-blue-600 hover:underline text-sm">
                            View Profile
                          </Link>
                        </div>
                        
                        <div className="px-4 py-3">
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                            <p className="text-gray-800 whitespace-pre-line">{application.coverLetter}</p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                  <p className="text-gray-600">
                    When freelancers apply to this job, their applications will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="accepted">
              {acceptedApplications.length > 0 ? (
                <div className="space-y-6">
                  {acceptedApplications.map((application) => {
                    const freelancer = application.freelancerId;
                    return (
                      <div key={application.id} className="border border-green-200 rounded-lg overflow-hidden">
                        <div className="border-b border-green-200 px-4 py-3 bg-green-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <div className="font-medium">Freelancer #{freelancer.substring(0, 8)}</div>
                              <div className="text-sm text-gray-500">
                                Accepted {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                          
                          <Link to={`/applicants/${application.freelancerId}`} className="text-blue-600 hover:underline text-sm">
                            View Profile
                          </Link>
                        </div>
                        
                        <div className="px-4 py-3">
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                            <p className="text-gray-800 whitespace-pre-line">{application.coverLetter}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted applications</h3>
                  <p className="text-gray-600">
                    When you accept applicants, they will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected">
              {rejectedApplications.length > 0 ? (
                <div className="space-y-6">
                  {rejectedApplications.map((application) => {
                    const freelancer = application.freelancerId;
                    return (
                      <div key={application.id} className="border border-red-100 rounded-lg overflow-hidden">
                        <div className="border-b border-red-100 px-4 py-3 bg-red-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <div className="font-medium">Freelancer #{freelancer.substring(0, 8)}</div>
                              <div className="text-sm text-gray-500">
                                Rejected {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                          
                          <Link to={`/applicants/${application.freelancerId}`} className="text-blue-600 hover:underline text-sm">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected applications</h3>
                  <p className="text-gray-600">
                    When you reject applicants, they will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicants;
