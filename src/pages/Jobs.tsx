
import React from 'react';
import { useData } from '@/context/DataContext';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobFilters from '@/components/jobs/JobFilters';
import useJobFilters from '@/hooks/useJobFilters';

// All available skills for filtering
const ALL_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'UI/UX', 'Figma', 'Adobe XD', 
  'Sketch', 'WordPress', 'PHP', 'CSS', 'JavaScript', 'Mobile Design', 'iOS', 'Android',
  'Payment API'
];

const Jobs: React.FC = () => {
  const { jobs } = useData();
  const navigate = useNavigate();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedSkills,
    toggleSkill,
    clearFilters,
    filteredJobs
  } = useJobFilters(jobs);

  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={handleBackClick} className="text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-gray-600">
          <Link to="/" className="flex items-center">
            <Home className="h-4 w-4 mr-1" /> Home
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Jobs</h1>
        <p className="text-lg text-gray-600">Browse and apply to the latest freelance opportunities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <JobFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
            clearFilters={clearFilters}
            availableSkills={ALL_SKILLS}
          />
        </div>
        
        {/* Job listings */}
        <div className="lg:col-span-3">
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters to find more opportunities.
              </p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
