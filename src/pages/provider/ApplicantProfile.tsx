
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { ArrowLeft, User, Briefcase } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';

const ApplicantProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useData();
  
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
              {freelancerProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {freelancerProjects.map(project => (
                    <div key={project.id} className="border rounded-lg overflow-hidden">
                      {project.images.length > 0 && (
                        <div className="h-48 w-full">
                          <img 
                            src={project.images[0]} 
                            alt={project.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                      </div>
                    </div>
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                  <p className="text-gray-800">
                    This is a demo freelancer profile. In a real application, you would see the freelancer's actual bio here, describing their experience, background, and areas of expertise.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'TypeScript', 'UI/UX Design'].map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">Senior Frontend Developer</div>
                      <div className="text-sm text-gray-600">TechCorp Inc.</div>
                      <div className="text-xs text-gray-500">2019 - Present</div>
                    </div>
                    <div>
                      <div className="font-medium">Web Developer</div>
                      <div className="text-sm text-gray-600">Design Studio XYZ</div>
                      <div className="text-xs text-gray-500">2016 - 2019</div>
                    </div>
                  </div>
                </div>
              </div>
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
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <User className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="font-bold text-xl">Freelancer #{freelancerId?.substring(0, 8)}</h3>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
                  <p className="font-medium">January 2022</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                  <p className="font-medium">San Francisco, USA</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Languages</h4>
                  <p className="font-medium">English (Fluent), Spanish (Conversational)</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
