
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Job } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ALL_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'UI/UX', 'Figma', 'Adobe XD', 
  'Sketch', 'WordPress', 'PHP', 'CSS', 'JavaScript', 'Mobile Design', 'iOS', 'Android',
  'Payment API'
];

const Jobs: React.FC = () => {
  const { jobs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const filteredJobs = jobs.filter(job => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected skills
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.some(skill => job.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Jobs</h1>
        <p className="text-lg text-gray-600">Browse and apply to the latest freelance opportunities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedSkills.includes(skill) 
                            ? "bg-blue-500 hover:bg-blue-600" 
                            : "hover:bg-blue-50"
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedSkills.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm text-blue-600"
                    onClick={() => setSelectedSkills([])}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
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
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkills([]);
                }}
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
