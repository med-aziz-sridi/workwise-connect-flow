
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budget: z.string()
    .min(1, 'Budget is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid number')
    .transform((val) => Number(val)), // Transform the string to a number
  skills: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PostJob = () => {
  const { user } = useAuth();
  const { addJob } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      skills: '',
    },
  });
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can post jobs" 
      />
    );
  }
  
  const onSubmit = (data: FormValues) => {
    // Convert skills string to array
    const skillsArray = data.skills ? data.skills.split(',').map(skill => skill.trim()) : [];
    
    // Add the job
    addJob({
      title: data.title,
      description: data.description,
      budget: data.budget, // Now this is correctly a number
      skills: skillsArray,
      providerId: user.id,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
    
    toast({
      title: "Job Posted Successfully",
      description: "Your job has been posted and is now visible to freelancers.",
    });
    
    navigate('/my-jobs');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        placeholder="Describe the job requirements, expectations, and deliverables..."
                        className="min-h-32"
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
                        placeholder="Enter your budget" 
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. React, TypeScript, UI Design" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Post Job
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJob;
