
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MoreVertical, Edit, Trash, Lock } from 'lucide-react';
import { Job } from '@/types';
import { useData } from '@/context/DataContext';

interface JobActionsProps {
  job: Job;
}

const JobActions: React.FC<JobActionsProps> = ({ job }) => {
  const navigate = useNavigate();
  const { updateJob, deleteJob } = useData();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-job/${job.id}`);
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteJob(job.id);
      toast.success('Job successfully deleted');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCloseJob = async () => {
    setIsProcessing(true);
    try {
      await updateJob({
        ...job,
        status: 'closed'
      });
      toast.success('Job successfully closed');
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error('Failed to close job');
    } finally {
      setIsProcessing(false);
      setIsCloseDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" /> Edit Job
          </DropdownMenuItem>
          {job.status === 'open' && (
            <DropdownMenuItem onClick={() => setIsCloseDialogOpen(true)}>
              <Lock className="h-4 w-4 mr-2" /> Close Job
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" /> Delete Job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Job Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job and notify all applicants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Deleting...' : 'Delete Job'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Job Confirmation Dialog */}
      <AlertDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the job as closed and it will no longer appear in active job listings.
              Applicants will be notified that the position has been filled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCloseJob} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Closing...' : 'Close Job'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JobActions;
