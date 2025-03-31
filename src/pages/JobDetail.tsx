
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Clock, User, DollarSign } from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, applications, applyToJob } = useData();
  const { user } = useAuth();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }
  
  const alreadyApplied = user?.role === 'freelancer' && 
    applications.some(app => app.jobId === job.id && app.freelancerId === user.id);
  
  const myApplication = user?.role === 'freelancer' ?
    applications.find(app => app.jobId === job.id && app.freelancerId === user.id) : null;
  
  const isJobProvider = user?.id === job.providerId;
  const canApply = user?.role === 'freelancer' && !alreadyApplied;
  
  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (coverLetter.trim().length < 10) {
      return;
    }
    
    applyToJob(job.id, coverLetter);
    setIsDialogOpen(false);
    setCoverLetter('');
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/jobs" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
          </Link>
        </Button>
        
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center text-gray-600 mt-2 space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{job.providerName}</span>
              </div>
            </div>
          </div>
          
          <Badge className="text-lg py-2 px-4 bg-green-500 hover:bg-green-500">
            <DollarSign className="h-4 w-4 mr-1" /> {job.budget}
          </Badge>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{job.description}</p>
        </div>
      </div>
      
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Want to apply for this job?</h3>
          <p className="text-blue-700 mb-4">You need to log in or create an account first.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
      
      {alreadyApplied && myApplication && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            You've already applied to this job
          </h3>
          <p className="text-green-700 mb-2">
            Application status: <Badge className="ml-2">{myApplication.status}</Badge>
          </p>
          <div className="bg-white p-4 rounded border border-green-100 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your cover letter:</h4>
            <p className="text-gray-600 text-sm whitespace-pre-line">{myApplication.coverLetter}</p>
          </div>
        </div>
      )}
      
      {isJobProvider && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">This is your job posting</h3>
          <p className="text-yellow-700 mb-4">
            You can view and manage applications from the dashboard.
          </p>
          <Button asChild>
            <Link to="/my-jobs">Manage Job Postings</Link>
          </Button>
        </div>
      )}
      
      {canApply && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Interested in this job?</h3>
          <p className="text-blue-700 mb-4">
            Apply now to get in touch with the client and discuss the project details.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Apply Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for: {job.title}</DialogTitle>
                <DialogDescription>
                  Write a cover letter explaining why you're a good fit for this job.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Describe your relevant experience and why you're interested in this project..."
                  className="min-h-[200px]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                {coverLetter.length < 10 && coverLetter.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Your cover letter should be more detailed.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleApply} 
                  disabled={coverLetter.trim().length < 10}
                >
                  Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
