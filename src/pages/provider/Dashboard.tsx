import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Users, Briefcase, Clock, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { CurrentProjectsSection } from '@/components/projects/CurrentProjectsSection';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { jobs, applications } = useData();
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can access the provider dashboard" 
      />
    );
  }
  
  // Get jobs posted by this provider
  const myJobs = jobs.filter(job => job.providerId === user.id);
  
  // Get applications for this provider's jobs
  const myApplications = applications.filter(app => 
    myJobs.some(job => job.id === app.jobId)
  );
  
  // Get active projects (jobs with accepted applications)
  const currentProjects = myJobs.filter(job => 
    applications.some(app => app.jobId === job.id && app.status === 'accepted')
  );
  
  // Stats
  const activeJobs = myJobs.filter(job => job.status === 'open').length;
  const totalApplicants = myApplications.length;
  const pendingApplications = myApplications.filter(app => app.status === 'pending').length;
  const acceptedApplications = myApplications.filter(app => app.status === 'accepted').length;
  
  // Data for charts
  const applicationsByJob = myJobs.map(job => ({
    name: job.title.length > 20 ? job.title.substring(0, 20) + '...' : job.title,
    applications: myApplications.filter(app => app.jobId === job.id).length,
  }));
  
  // Budget and spending data (simulated for demonstration)
  const totalBudget = myJobs.reduce((total, job) => total + job.budget, 0);
  const spentBudget = totalBudget * 0.65; // Simulated spending (65% of total budget)
  const remainingBudget = totalBudget - spentBudget;
  
  // Monthly spending/budget data (simulated)
  const budgetData = [
    { month: 'Jan', budget: 9000, spent: 7500 },
    { month: 'Feb', budget: 10000, spent: 8200 },
    { month: 'Mar', budget: 12000, spent: 9800 },
    { month: 'Apr', budget: 11000, spent: 8500 },
    { month: 'May', budget: 13000, spent: 10200 },
    { month: 'Jun', budget: 14000, spent: 9800 },
  ];
  
  // Recent applications
  const recentApplications = myApplications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your job postings and applicants</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Current Projects Section */}
      <div className="mb-8">
        <CurrentProjectsSection 
          currentProjects={currentProjects}
          applications={applications}
          userId={user.id}
          userRole="provider"
        />
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{activeJobs}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/my-jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalApplicants}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/my-jobs">View Applicants</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">${totalBudget.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-100 h-2 rounded-full">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(spentBudget / totalBudget) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>Spent: ${spentBudget.toLocaleString()}</span>
                <span>Remaining: ${remainingBudget.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Working Freelancers</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{acceptedApplications}</h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/working-freelancers">View Team</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Jobs */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50">
                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
                          {job.title}
                        </Link>
                      </h4>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-medium">${job.budget}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <Badge 
                          variant={job.status === 'open' ? "default" : "outline"}
                          className={job.status === 'open' ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No jobs posted yet.</p>
                <Button asChild className="mt-2">
                  <Link to="/post-job">Post a Job</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Applications */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => {
                  const job = jobs.find(j => j.id === application.jobId);
                  if (!job) return null;
                  
                  return (
                    <div key={application.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            <Link 
                              to={`/applicants/${application.freelancerId}`} 
                              className="hover:text-blue-600"
                            >
                              {application.freelancer?.name || 'Applicant'}
                            </Link>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Applied for: <Link to={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
                          </p>
                        </div>
                        <Badge 
                          variant={
                            application.status === 'pending' ? "outline" : 
                            application.status === 'accepted' ? "default" : 
                            "secondary"
                          }
                          className={
                            application.status === 'pending' ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                            application.status === 'accepted' ? "bg-green-100 text-green-800 border-green-200" : 
                            "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No applications received yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Budget and Spending Chart */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget & Spending Tracker</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
              <span className="text-xs">Budget</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">Spent</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            budget: { theme: { light: '#9b87f5', dark: '#9b87f5' } },
            spent: { theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
          }} className="h-80">
            <AreaChart
              data={budgetData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value.toLocaleString()}`} />} />
              <Area 
                type="monotone" 
                dataKey="budget" 
                stroke="#9b87f5" 
                fillOpacity={1} 
                fill="url(#colorBudget)" 
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="spent" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorSpent)" 
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Applications Chart */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Applications per Job</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationsByJob.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsByJob}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 80,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No jobs data available. Post jobs to see statistics.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboard;
