
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Upload, User, ArrowLeft } from 'lucide-react';
import ProjectCard from '@/components/freelancers/ProjectCard';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/types';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { projects, deleteProject } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [coverPicture, setCoverPicture] = useState(user?.coverPicture || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) {
    return <AuthRequiredPage message="Please log in to view your profile" />;
  }
  
  const userProjects = projects.filter(project => project.freelancerId === user.id);
  
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleProfilePictureChange = () => {
    const url = prompt('Enter image URL for profile picture:');
    if (url) setProfilePicture(url);
  };
  
  const handleCoverPictureChange = () => {
    const url = prompt('Enter image URL for cover picture:');
    if (url) setCoverPicture(url);
  };
  
  const handleSaveProfile = () => {
    updateUser({
      name,
      bio,
      profilePicture,
      coverPicture,
      skills,
    });
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    
    toast({
      title: "Project deleted",
      description: "Your project has been removed from your portfolio",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="relative w-full">
        {/* Cover image */}
        <div 
          className="w-full h-80 bg-gray-200 rounded-xl overflow-hidden relative shadow-md"
          style={{
            backgroundImage: coverPicture ? `url(${coverPicture})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-gray-800 text-white hover:bg-gray-700"
              onClick={handleCoverPictureChange}
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Cover
            </Button>
          )}
        </div>
        
        {/* Profile picture and name */}
        <div className="absolute -bottom-16 left-8 flex items-end space-x-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={profilePicture} alt={user.name} />
              <AvatarFallback className="text-4xl bg-blue-500 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-0 right-0 bg-gray-800 text-white hover:bg-gray-700 rounded-full h-8 w-8 p-0"
                onClick={handleProfilePictureChange}
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {!isEditing && (
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.role === 'freelancer' ? 'Freelancer' : 'Job Provider'}</p>
            </div>
          )}
        </div>
        
        {/* Edit profile button */}
        <div className="absolute -bottom-16 right-8">
          {isEditing ? (
            <Button 
              onClick={handleSaveProfile} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-24">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {user.role === 'freelancer' && (
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name"
                        className="max-w-md"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        placeholder="Tell us about yourself"
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    {user.role === 'freelancer' && (
                      <div className="grid gap-2">
                        <Label htmlFor="skills">Skills</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {skills.map((skill) => (
                            <Badge key={skill} className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {skill}
                              <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-700 hover:text-blue-900">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-md">
                          <Input 
                            id="skills" 
                            value={skillInput} 
                            onChange={(e) => setSkillInput(e.target.value)} 
                            placeholder="Add a skill"
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                          />
                          <Button type="button" size="sm" onClick={addSkill}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                      <p className="mt-1 text-gray-900 leading-relaxed">{bio || 'No bio provided'}</p>
                    </div>
                    
                    {user.role === 'freelancer' && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {skills.length > 0 ? (
                            skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">No skills added yet</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Member since</h3>
                      <p className="mt-1 text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {user.role === 'freelancer' && (
            <TabsContent value="portfolio" className="mt-6">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Portfolio Projects</CardTitle>
                  <Button asChild>
                    <a href="/add-project">
                      <Plus className="h-4 w-4 mr-2" /> Add Project
                    </a>
                  </Button>
                </CardHeader>
                <CardContent>
                  {userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProjects.map((project) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          onDelete={() => handleDeleteProject(project.id)} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <User className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding your first portfolio project.
                      </p>
                      <div className="mt-6">
                        <Button asChild>
                          <a href="/add-project">
                            <Plus className="h-4 w-4 mr-2" /> Add Project
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
