import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Briefcase,
  User,
  FileText,
  Inbox,
  Check,
  X,
  Info,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const { applications, jobs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  if (!user || user.role !== 'freelancer') {
    return <AuthRequiredPage role="freelancer" message="Only freelancers can view applications" />;
  }

  const userApplications = applications
    .filter(app => app.freelancerId === user.id)
    .filter(app => {
      const job = jobs.find(job => job.id === app.jobId);
      return (
        job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter(app => !selectedStatus || app.status === selectedStatus);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = userApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userApplications.length / itemsPerPage);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          class: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="h-3.5 w-3.5 mr-1.5" />
        };
      case 'accepted':
        return { 
          class: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <Check className="h-3.5 w-3.5 mr-1.5" />
        };
      case 'rejected':
        return { 
          class: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <X className="h-3.5 w-3.5 mr-1.5" />
        };
      default:
        return { 
          class: 'bg-gray-50 text-gray-800 border-gray-200',
          icon: <Info className="h-3.5 w-3.5 mr-1.5" />
        };
    }
  };

  const getJobById = (jobId: string) => jobs.find(job => job.id === jobId);

  const Pagination = () => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, userApplications.length)} 
        of {userApplications.length} results
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl w-full px-4 sm:px-6 py-8 lg:py-12 lg:px-0 mx-auto">
      <div className="mb-8 space-y-1">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track your job applications and their status</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setSelectedStatus(null)}
            className={`border-gray-200 ${
              !selectedStatus ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({applications.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedStatus('pending')}
            className={`border-amber-200 ${
              selectedStatus === 'pending' 
                ? 'bg-amber-100 text-amber-900' 
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            Pending
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedStatus('accepted')}
            className={`border-emerald-200 ${
              selectedStatus === 'accepted'
                ? 'bg-emerald-100 text-emerald-900'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Accepted
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedStatus('rejected')}
            className={`border-rose-200 ${
              selectedStatus === 'rejected'
                ? 'bg-rose-100 text-rose-900'
                : 'text-rose-800 hover:bg-rose-50'
            }`}
          >
            Rejected
          </Button>
        </div>
      </div>

      <Card className="shadow-sm w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Application History</CardTitle>
              <CardDescription className="text-gray-600">
                {userApplications.length} results found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {currentApplications.length > 0 ? (
            <div className="space-y-4">
              {currentApplications.map(application => {
                const job = getJobById(application.jobId);
                if (!job) return null;
                const statusConfig = getStatusConfig(application.status);

                return (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <Link 
                              to={`/jobs/${job.id}`} 
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {job.title}
                            </Link>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                            Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                          </div>
                        </div>

                        <Badge 
                          className={`${statusConfig.class} px-3 py-1.5 rounded-full pointer-events-none`}
                        >
                          {statusConfig.icon}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Client</p>
                              <p className="font-medium">{job.providerName}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Budget</p>
                              <p className="font-medium text-emerald-600">
                                ${Number(job.budget).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Cover Letter</p>
                              <p className="font-medium">
                                {application.coverLetter ? 'Submitted' : 'Not included'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button asChild className="w-full sm:w-auto" variant="outline">
                          <Link to={`/jobs/${job.id}`}>View Job Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <Pagination />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
              <Inbox className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 max-w-md mb-6">
                {searchQuery || selectedStatus 
                  ? "No applications match your current filters."
                  : "You haven't applied to any jobs yet. Browse available opportunities and submit your first application!"}
              </p>
              <Button asChild>
                <Link to="/jobs" className="gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  Explore Jobs
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;