
import { useState, useMemo } from 'react';
import { Job } from '@/types';

export default function useJobFilters(jobs: Job[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
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
  }, [jobs, searchQuery, selectedSkills]);

  return {
    searchQuery,
    setSearchQuery,
    selectedSkills,
    toggleSkill,
    clearFilters,
    filteredJobs
  };
}
