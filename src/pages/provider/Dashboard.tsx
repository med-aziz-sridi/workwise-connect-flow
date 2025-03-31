
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BriefcaseBusiness, Bell, User, Plus, Users } from 'lucide-react';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applications, notifications } = useData();
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can access this dashboard" 
      />
    );
  }
  
  const providerJobs = jobs.filter(job => job.providerId === user.id);
  const openJobs = providerJobs.filter(job => job.status === 'open');
  const totalApplications = applications.filter(app => 
    providerJobs.some(job => job.id === app.jobId)
  );
  
  const unreadNotifications = notifications.filter(n => n.userId === user.id && !n.read).length;
  
  const pendingApplications = totalApplications.filter(app => app.status === 'pending');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Provider Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Jobs</CardTitle>
            <CardDescription>Your open positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-blue-600">{openJobs.length}</div>
              <div className="text-gray-600 mt-2">of {providerJobs.length} total jobs</div>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link to="/my-jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Applications</CardTitle>
            <CardDescription>Candidates for your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-blue-600">{totalApplications.length}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {pendingApplications.length} Pending
                </Badge>
              </div>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link to="/my-jobs">Review Applications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-blue-600">{unreadNotifications}</div>
              <div className="text-gray-600 mt-2">Unread notifications</div>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link to="/notifications">View All Notifications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Profile</CardTitle>
            <CardDescription>Company information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">Job Provider</div>
              </div>
            </div>
            <Button asChild className="mt-4 w-full" variant="outline" size="sm">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Jobs you've recently posted</CardDescription>
              </div>
              <Button asChild>
                <Link to="/post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {providerJobs.length > 0 ? (
                <div className="space-y-4">
                  {providerJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/jobs/${job.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                            {job.title}
                          </Link>
                          <div className="flex items-center mt-1 text-gray-500 text-sm">
                            <BriefcaseBusiness className="h-4 w-4 mr-1" />
                            <span>
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant={job.status === 'open' ? "success" : "secondary"}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center mt-3 gap-2">
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-1" />
                          {applications.filter(app => app.jobId === job.id).length} applicants
                        </div>
                        
                        <div className="flex flex-wrap gap-1 ml-4">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-end">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/jobs/${job.id}/applicants`}>
                            View Applicants
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BriefcaseBusiness className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto mt-1 mb-3">
                    Create your first job posting to start finding talented freelancers.
                  </p>
                  <Button asChild>
                    <Link to="/post-job">Post Your First Job</Link>
                  </Button>
                </div>
              )}
              
              {providerJobs.length > 3 && (
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link to="/my-jobs">View All Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Stay updated with your activity</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.filter(n => n.userId === user.id).slice(0, 5).length > 0 ? (
                <div className="space-y-4">
                  {notifications.filter(n => n.userId === user.id).slice(0, 5).map(notification => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-start gap-3">
                        <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                        <div>
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
                  <p className="text-gray-600 mt-1">
                    When you have new activity, it will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
