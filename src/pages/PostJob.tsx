import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, DollarSign, Search, Users, Calendar } from 'lucide-react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const commonSkills = [
  'React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'GraphQL', 'REST API', 'SQL', 'MongoDB', 'Firebase', 'AWS',
  'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
  'Project Management', 'Agile', 'Scrum', 'Jira', 'Trello',
  'Content Writing', 'SEO', 'Digital Marketing', 'Social Media',
  'Data Analysis', 'Machine Learning', 'Artificial Intelligence',
  'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native',
];

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createJob, jobs } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [isSkillPopoverOpen, setIsSkillPopoverOpen] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (newSkill.trim() === '') {
      setFilteredSkills([]);
    } else {
      const filtered = commonSkills.filter(skill => 
        skill.toLowerCase().includes(newSkill.toLowerCase()) && 
        !skills.includes(skill)
      );
      setFilteredSkills(filtered);
    }
  }, [newSkill, skills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !budget || skills.length === 0 || !deadline) {
      toast.error('Please fill in all required fields and add at least one skill');
      return;
    }
    
    try {
      await createJob({
        title,
        description,
        skills,
        budget: Number(budget),
        coverImage: undefined,
        numberOfPeople: Number(numberOfPeople),
        deadline
      });
      
      toast.success('Job posted successfully');
      navigate('/my-jobs');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post job');
    }
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmedSkill = skillToAdd.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill('');
      setFilteredSkills([]);
      setIsSkillPopoverOpen(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSkill.trim()) {
        handleAddSkill(newSkill);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide detailed information to attract qualified freelancers
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Full Stack Developer Needed for E-commerce Website"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the project, requirements, and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="budget" 
                    type="number"
                    placeholder="e.g., 1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-10"
                    required
                    min="1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfPeople">Number of People Needed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Select 
                    value={numberOfPeople}
                    onValueChange={setNumberOfPeople}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="deadline" 
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="pl-10"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2">
                <Popover open={isSkillPopoverOpen} onOpenChange={setIsSkillPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        id="skills" 
                        placeholder="Search or type a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10"
                        onFocus={() => setIsSkillPopoverOpen(true)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px]" align="start" side="bottom" sideOffset={5}>
                    <Command>
                      <CommandInput placeholder="Search skills..." value={newSkill} onValueChange={setNewSkill} />
                      <CommandList>
                        <CommandEmpty>
                          {newSkill.trim() ? (
                            <div className="py-3 px-4">
                              <p>No matching skills</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleAddSkill(newSkill)}
                              >
                                Add "{newSkill}"
                              </Button>
                            </div>
                          ) : (
                            <p className="py-3 px-4">Type to search skills</p>
                          )}
                        </CommandEmpty>
                        {filteredSkills.length > 0 && (
                          <CommandGroup heading="Available Skills">
                            {filteredSkills.slice(0, 10).map((skill) => (
                              <CommandItem 
                                key={skill} 
                                value={skill}
                                onSelect={() => handleAddSkill(skill)}
                              >
                                {skill}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        {newSkill.trim() && !commonSkills.some(skill => skill.toLowerCase() === newSkill.toLowerCase()) && (
                          <CommandGroup heading="Add Custom Skill">
                            <CommandItem onSelect={() => handleAddSkill(newSkill)}>
                              Add "{newSkill}"
                            </CommandItem>
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button type="button" onClick={() => newSkill.trim() && handleAddSkill(newSkill)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <span className="text-gray-500 text-sm">No skills added yet</span>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Post Job</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default PostJob;
