import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Bell, User, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import { AvailabilityBadge } from '@/components/ui/availability-badge';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { CollaborativeChecklist } from '@/components/dashboard/CollaborativeChecklist';

interface ChecklistItems {
  [key: string]: Array<{
    id: string;
    text: string;
    completed: boolean;

  }>;
}

const FreelancerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applications, notifications } = useData();
  const [checklists, setChecklists] = useState<ChecklistItems>({});

  if (!user || user.role !== 'freelancer') {
    return (
      <AuthRequiredPage 
        role="freelancer" 
        message="Only freelancers can access this dashboard" 
      />
    );
  }

  // Data processing
  const userSkills = user.skills || [];
  const userApplications = applications.filter(app => app.freelancerId === user.id);
  const currentJobs = userApplications
    .filter(app => app.status === 'accepted')
    .map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return job ? { ...job, applicationId: app.id ,
        deadline: job.deadline || new Date(Date.now() + 604800000).toISOString() 
      } : null;
    })
    .filter(Boolean);

  const handleChecklistUpdate = (jobId: string, items: any[]) => {
    setChecklists(prev => ({ ...prev, [jobId]: items }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Availability Status:</span>
          <AvailabilityBadge showButton={true} size="lg" />
        </div>
      </div>

      {/* Current Jobs Section */}
      {currentJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {job.providerName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-2">
                        <DollarSign className="h-4 w-4" />
                        Budget: ${job.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Project Checklist</h3>
                      <CollaborativeChecklist
                        items={checklists[job.id] || []}
                        onUpdate={(items) => handleChecklistUpdate(job.id, items)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 gap-1">
                        <Link to={`/messages/${job.providerId}`}>
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="gap-1">
                        <Link to={`/jobs/${job.id}`}>
                          <Briefcase className="h-4 w-4" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Applications Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Applications</CardTitle>
            <CardDescription>Your job applications status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {userApplications.length}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                {userApplications.filter(a => a.status === 'pending').length} Pending
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {userApplications.filter(a => a.status === 'accepted').length} Accepted
              </Badge>
            </div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link to="/applications">View All Applications</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Recent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {notifications.filter(n => !n.read).length}
            </div>
            <div className="text-gray-600 mt-2">Unread notifications</div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link to="/notifications">View Notifications</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Your public profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="rounded-full" />
                ) : (
                  <User className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {user.skills?.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>
            <Button asChild className="mt-4 w-full" variant="outline" size="sm">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Jobs & Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Suggested Jobs</CardTitle>
                <CardDescription>Based on your skills</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {jobs.filter(job => job.status === 'open').slice(0, 3).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;