
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
  clearFilters: () => void;
  availableSkills: string[];
}

const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedSkills,
  toggleSkill,
  clearFilters,
  availableSkills
}) => {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
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
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
