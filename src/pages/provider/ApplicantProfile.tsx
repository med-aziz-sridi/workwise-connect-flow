
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ArrowLeft, User, Briefcase, MapPin, Globe } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for the freelancer profile data
interface FreelancerProfile {
  id: string;
  name: string;
  bio?: string;
  email: string;
  profile_picture?: string;
  skills?: string[];
  created_at: string;
  location?: string;
  languages?: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
}

const ApplicantProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useData();
  
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch the freelancer profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch freelancer experiences
        const { data: experienceData, error: experienceError } = await supabase
          .from('experiences')
          .select('*')
          .eq('freelancer_id', id)
          .order('start_date', { ascending: false });
        
        if (experienceError) throw experienceError;
        setExperiences(experienceData);
      } catch (error) {
        console.error('Error fetching freelancer data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreelancerData();
  }, [id]);
  
  if (!user || user.role !== 'provider') {
    return (
      <AuthRequiredPage 
        role="provider" 
        message="Only job providers can view applicant profiles" 
      />
    );
  }
  
  const freelancerId = id;
  const freelancerProjects = projects.filter(p => p.freelancerId === freelancerId);
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const renderProfileSkeleton = () => (
    <>
      <div className="flex flex-col items-center mb-6">
        <Skeleton className="h-24 w-24 rounded-full mb-3" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Separator className="mb-6" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </>
  );
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/my-jobs" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Profile</h1>
        <p className="text-gray-600 mt-2">Reviewing applicant's skills and portfolio</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Portfolio Projects</CardTitle>
              <CardDescription>
                Projects completed by this freelancer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : freelancerProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {freelancerProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
                  <p className="text-gray-600">
                    This freelancer hasn't added any portfolio projects yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About Freelancer</CardTitle>
              <CardDescription>
                Professional background and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Separator />
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-6 w-20" />
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i}>
                          <Skeleton className="h-5 w-48 mb-1" />
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-gray-800">
                      {profile?.bio || "This freelancer hasn't added a bio yet."}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills && profile.skills.length > 0 ? 
                        profile.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        )) : 
                        <p className="text-gray-500">No skills listed</p>
                      }
                    </div>
                  </div>
                  
                  {profile?.languages && profile.languages.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Languages</h3>
                        <p className="font-medium">
                          {profile.languages.join(', ')}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                    {experiences.length > 0 ? (
                      <div className="space-y-3">
                        {experiences.map(exp => (
                          <div key={exp.id}>
                            <div className="font-medium">{exp.title}</div>
                            <div className="text-sm text-gray-600">{exp.company}</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(exp.start_date)} - {exp.current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : ''}
                            </div>
                            {exp.description && (
                              <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No experience listed</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Freelancer Details</CardTitle>
              <CardDescription>
                Contact information and summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                renderProfileSkeleton()
              ) : (
                <>
                  <div className="flex flex-col items-center mb-6">
                    {profile?.profile_picture ? (
                      <img 
                        src={profile.profile_picture} 
                        alt={profile.name} 
                        className="h-24 w-24 rounded-full object-cover mb-3"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <User className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                    <h3 className="font-bold text-xl">{profile?.name || 'Freelancer'}</h3>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
                      <p className="font-medium">
                        {profile ? formatDate(profile.created_at) : 'Loading...'}
                      </p>
                    </div>
                    
                    {profile?.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          <span className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Location
                          </span>
                        </h4>
                        <p className="font-medium">{profile.location}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        <span className="flex items-center">
                          <Globe className="h-3.5 w-3.5 mr-1" /> Languages
                        </span>
                      </h4>
                      <p className="font-medium">
                        {profile?.languages && profile.languages.length > 0 
                          ? profile.languages.join(', ') 
                          : 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Completed Projects</h4>
                      <p className="font-medium">{freelancerProjects.length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full" onClick={() => navigate(-1)}>
                      Return to Applications
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
