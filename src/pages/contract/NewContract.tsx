
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import ContractForm from '@/components/contract/ContractForm';
import { ArrowLeft } from 'lucide-react';

const NewContract: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { applications } = useData();
  
  const application = applications.find(app => app.id === applicationId);
  
  if (!application) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Application not found</h2>
            <p className="text-gray-600 mb-4">
              The application you're trying to create a contract for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/my-jobs">Back to My Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to={`/jobs/${application.jobId}/applicants`} className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applicants
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractForm application={application} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewContract;
