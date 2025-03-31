
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Bell, User } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const FreelancerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applications, notifications } = useData();
  
  if (!user || user.role !== 'freelancer') {
    return (
      <AuthRequiredPage 
        role="freelancer" 
        message="Only freelancers can access this dashboard" 
      />
    );
  }
  
  const userSkills = user.skills || [];
  const matchingJobs = jobs
    .filter(job => job.status === 'open' && job.skills.some(skill => userSkills.includes(skill)))
    .slice(0, 3);
  
  const userApplications = applications.filter(app => app.freelancerId === user.id);
  const unreadNotifications = notifications.filter(n => n.userId === user.id && !n.read).length;
  
  const pendingApplications = userApplications.filter(app => app.status === 'pending');
  const acceptedApplications = userApplications.filter(app => app.status === 'accepted');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-blue-600">{userApplications.length}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {pendingApplications.length} Pending
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {acceptedApplications.length} Accepted
                </Badge>
              </div>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link to="/applications">View All Applications</Link>
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
            <CardDescription>Make a great impression</CardDescription>
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
                <div className="text-sm text-gray-500">{user.skills?.join(', ').slice(0, 25)}...</div>
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
                <CardTitle>Jobs For You</CardTitle>
                <CardDescription>Based on your skills and experience</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {matchingJobs.length > 0 ? (
                <div className="space-y-4">
                  {matchingJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No matching jobs found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mt-1 mb-3">
                    Update your profile with more skills to find relevant job opportunities.
                  </p>
                  <Button asChild>
                    <Link to="/profile">Update Skills</Link>
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

export default FreelancerDashboard;
