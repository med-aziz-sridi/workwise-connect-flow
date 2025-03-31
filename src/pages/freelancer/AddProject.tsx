
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const projectSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' }),
  images: z
    .array(z.string())
    .min(1, { message: 'Add at least one image to showcase your project' }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

// Placeholder image URLs for demo purposes
const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600',
];

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProject } = useData();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      images: [],
    },
  });
  
  if (!user || user.role !== 'freelancer') {
    return (
      <AuthRequiredPage 
        role="freelancer" 
        message="Only freelancers can add projects" 
      />
    );
  }
  
  const addImage = (imageUrl: string) => {
    if (!selectedImages.includes(imageUrl)) {
      const newImages = [...selectedImages, imageUrl];
      setSelectedImages(newImages);
      form.setValue('images', newImages);
    }
  };
  
  const removeImage = (imageUrl: string) => {
    const newImages = selectedImages.filter(img => img !== imageUrl);
    setSelectedImages(newImages);
    form.setValue('images', newImages);
  };
  
  const onSubmit = (data: ProjectFormValues) => {
    addProject({
      title: data.title,
      description: data.description,
      images: data.images,
    });
    
    navigate('/profile');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/profile" className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Project</CardTitle>
          <CardDescription>
            Showcase your work by adding projects to your portfolio
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. E-commerce Website Redesign" {...field} />
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
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project, your role, technologies used, challenges overcome, and results achieved..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Project Images</FormLabel>
                    <FormControl>
                      <div className="border border-dashed rounded-lg p-4">
                        <div className="mb-4 flex flex-wrap gap-4">
                          {selectedImages.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded overflow-hidden">
                              <img src={img} alt={`Project ${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(img)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {/* In a real app, this would be a file upload component */}
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-2">
                            For demo purposes, select from sample images:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {DEMO_IMAGES.map((img, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addImage(img)}
                                className="border rounded p-1 hover:border-blue-500"
                              >
                                <img src={img} alt={`Sample ${index + 1}`} className="w-16 h-16 object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-center border-t pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="text-blue-500"
                            onClick={() => {
                              // In a real app, this would trigger a file upload dialog
                              const randomIndex = Math.floor(Math.random() * DEMO_IMAGES.length);
                              addImage(DEMO_IMAGES[randomIndex]);
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Custom Image
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    {form.formState.errors.images && (
                      <FormMessage>{form.formState.errors.images.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">
                Add Project
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddProject;
