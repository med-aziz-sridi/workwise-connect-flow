import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
const Applications: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    applications,
    jobs
  } = useData();
  if (!user || user.role !== 'freelancer') {
    return <AuthRequiredPage role="freelancer" message="Only freelancers can view applications" />;
  }
  const userApplications = applications.filter(app => app.freelancerId === user.id);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };
  return <div className="max-w-5xl px-4 sm:px-6 py-12 lg:px-0 mx-0">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage your job applications</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            View and track all your job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userApplications.length > 0 ? <div className="space-y-6">
              {userApplications.map(application => {
            const job = getJobById(application.jobId);
            if (!job) return null;
            return <div key={application.id} className="border rounded-lg overflow-hidden">
                    <div className="border-b px-4 py-3 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${job.id}`} className="font-medium text-blue-600 hover:underline">
                          {job.title}
                        </Link>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        Applied {formatDistanceToNow(new Date(application.createdAt), {
                    addSuffix: true
                  })}
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Job Provider</div>
                          <div className="font-medium">{job.providerName}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Budget</div>
                          <div className="flex items-center font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.budget}
                          </div>
                        </div>
                        
                        <div>
                          <Button asChild size="sm">
                            <Link to={`/jobs/${job.id}`}>View Job Details</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-1">Your Cover Letter</div>
                        <div className="p-3 bg-gray-50 rounded border text-sm">
                          {application.coverLetter}
                        </div>
                      </div>
                    </div>
                  </div>;
          })}
            </div> : <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't applied to any jobs yet. Start by browsing available jobs.
              </p>
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default Applications;