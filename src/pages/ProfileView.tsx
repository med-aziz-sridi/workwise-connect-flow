
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileById } from '@/services/userSearch';
import { UserSearchResult } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, FileText, Briefcase, Award, Star, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { useAuth } from '@/context/AuthContext';
import { getOrCreateConversation } from '@/services/messaging';
import RatingSection from '@/components/profile/RatingSection';
import { toast } from 'sonner';

const ProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const profileData = await getProfileById(id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);
  
  const handleStartChat = async () => {
    if (!user || !profile) return;
    
    try {
      const conversationId = await getOrCreateConversation(user.id, profile.id);
      if (conversationId) {
        navigate(`/conversation/${conversationId}`);
      } else {
        toast.error('Could not create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Profile not found</h2>
            <p className="mt-2 text-gray-600">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Convert the profile to a User object format for the RatingSection
  const userProfile = {
    id: profile.id,
    name: profile.name,
    email: '',
    role: profile.role,
    profilePicture: profile.profilePicture,
    skills: profile.skills,
    createdAt: new Date().toISOString(),
    verified: profile.verified,
    rating: profile.rating,
    totalRatings: 0
  };
  
  return (
    <div className="w-full min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="relative -mt-16 sm:-mt-20">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-white">
                  <AvatarImage src={profile.profilePicture} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-blue-600 text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="mt-6 sm:mt-0 sm:flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {profile.name}
                      </h1>
                      {profile.verified && <VerificationBadge className="ml-2" />}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 capitalize">
                        {profile.role}
                      </Badge>
                      
                      {profile.location && (
                        <Badge variant="outline">
                          {profile.location}
                        </Badge>
                      )}
                    </div>
                    
                    {profile.rating !== undefined && (
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (profile.rating || 0) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {profile.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {user && user.id !== profile.id && (
                    <div className="mt-4 sm:mt-0">
                      <Button onClick={handleStartChat}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            
            {profile.role === 'freelancer' && (
              <>
                <TabsTrigger value="portfolio" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
              </>
            )}
            
            <TabsTrigger value="ratings" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Ratings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">About</h3>
                <p className="text-gray-700">
                  {/* This would typically come from the database, but we don't have bio in our search results */}
                  {profile.role === 'freelancer' 
                    ? 'Freelancer specializing in their field of expertise.' 
                    : 'Job provider looking for talented freelancers.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {profile.role === 'freelancer' && (
            <>
              <TabsContent value="portfolio" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Portfolio</h3>
                    <p className="text-gray-500">Portfolio information would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Experience & Certifications</h3>
                    <p className="text-gray-500">Experience and certification information would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
          
          <TabsContent value="ratings" className="animate-in fade-in-50 duration-300">
            <RatingSection user={userProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileView;
