
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ImageUpload } from '@/components/ui/image-upload';

const AVAILABLE_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'UI/UX', 'Figma', 'Adobe XD', 
  'Sketch', 'WordPress', 'PHP', 'CSS', 'JavaScript', 'Mobile Design', 'iOS', 'Android',
  'Payment API'
];

const jobSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .min(30, { message: 'Description must be at least 30 characters' }),
  budget: z
    .string()
    .regex(/^\d+$/, { message: 'Budget must be a number' })
    .transform(val => parseInt(val, 10)),
  skills: z
    .array(z.string())
    .min(1, { message: 'Select at least one skill' }),
  coverImage: z
    .string()
    .optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createJob } = useData();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      skills: [],
      coverImage: '',
    },
  });
  
  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    if (currentSkills.includes(skill)) {
      form.setValue('skills', currentSkills.filter(s => s !== skill));
    } else {
      form.setValue('skills', [...currentSkills, skill]);
    }
  };
  
  const onSubmit = (data: JobFormValues) => {
    createJob({
      title: data.title,
      description: data.description,
      skills: data.skills,
      budget: data.budget,
      coverImage: data.coverImage,
    });
    
    navigate('/my-jobs');
  };
  
  if (user?.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can post jobs" 
      />
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
          <CardDescription>
            Create a detailed job posting to attract the right talent for your project
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange}
                        className="h-48 w-full" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Website Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the project, requirements, and deliverables in detail..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {AVAILABLE_SKILLS.map((skill) => {
                        const isSelected = form.watch('skills').includes(skill);
                        return (
                          <Badge
                            key={skill}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer ${
                              isSelected ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50"
                            }`}
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Post Job
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PostJob;
