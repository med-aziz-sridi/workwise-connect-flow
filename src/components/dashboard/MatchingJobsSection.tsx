import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";

interface MatchingJobsSectionProps {
  jobs: any[];
}

export const MatchingJobsSection = ({ jobs }: MatchingJobsSectionProps) => (
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
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
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
);