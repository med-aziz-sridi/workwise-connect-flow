
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Plus, Upload, X, Pencil } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';

const AVAILABLE_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'UI/UX', 'Figma', 'Adobe XD', 
  'Sketch', 'WordPress', 'PHP', 'CSS', 'JavaScript', 'Mobile Design', 'iOS', 'Android',
  'Payment API'
];

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  bio: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { projects, deleteProject } = useData();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      company: user?.role === 'provider' ? (user as any).company || '' : '',
      website: user?.role === 'provider' ? (user as any).website || '' : '',
      location: user?.role === 'provider' ? (user as any).location || '' : '',
    },
  });
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const onSubmit = (data: ProfileFormValues) => {
    const updateData: any = {
      ...data,
      skills: selectedSkills,
    };
    
    // Remove fields that are not relevant to the user role
    if (user?.role === 'freelancer') {
      delete updateData.company;
      delete updateData.website;
      delete updateData.location;
    }
    
    updateUser(updateData);
  };
  
  const userProjects = projects.filter(p => p.freelancerId === user?.id);
  
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">You need to be logged in to view your profile</h1>
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and portfolio</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile details and public information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            Your email address is used for login and cannot be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {user.role === 'freelancer' && (
                      <>
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell potential clients about your experience, skills, and what you love to work on..."
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel>Skills</FormLabel>
                          <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-3">
                            {AVAILABLE_SKILLS.map((skill) => {
                              const isSelected = selectedSkills.includes(skill);
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
                          {selectedSkills.length === 0 && (
                            <p className="text-sm text-red-500 mt-1">
                              Select at least one skill to help clients find you
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    
                    {user.role === 'provider' && (
                      <>
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company or organization" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourcompany.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Company</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Share information about your company and the types of projects you're looking for..."
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {user.role === 'freelancer' && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Portfolio Projects</CardTitle>
                  <CardDescription>
                    Showcase your work to potential clients
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link to="/add-project">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {userProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onDelete={() => deleteProject(project.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">
                      Add your best work to showcase your skills to potential clients
                    </p>
                    <Button asChild>
                      <Link to="/add-project">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                How others see your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden h-32 bg-blue-100 mb-6">
                {user.coverPicture ? (
                  <img 
                    src={user.coverPicture} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Button variant="ghost" className="text-blue-500">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Cover Image
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center -mt-12 relative z-10">
                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-full w-full rounded-full p-0"
                      >
                        <Upload className="h-6 w-6 text-blue-500" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xl mt-3">{form.watch('name') || user.name}</h3>
                <p className="text-gray-500 text-sm">{user.role === 'freelancer' ? 'Freelancer' : 'Job Provider'}</p>
                
                {user.role === 'freelancer' && (
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {selectedSkills.slice(0, 5).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                    {selectedSkills.length > 5 && (
                      <Badge variant="secondary" className="bg-gray-50 text-gray-700">
                        +{selectedSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {user.role === 'provider' && form.watch('company') && (
                  <p className="text-gray-700 mt-1">{form.watch('company')}</p>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-gray-600">
                  {form.watch('bio') || 'No bio provided yet'}
                </p>
              </div>
              
              {user.role === 'provider' && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Contact</h4>
                  <div className="text-sm">
                    {form.watch('website') && (
                      <p className="text-blue-600 hover:underline">
                        {form.watch('website')}
                      </p>
                    )}
                    {form.watch('location') && (
                      <p className="text-gray-600 mt-1">
                        {form.watch('location')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
