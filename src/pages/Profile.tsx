
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import FreelancerPortfolio from '@/components/profile/FreelancerPortfolio';
import ExperienceCertifications from '@/components/profile/ExperienceCertifications';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Briefcase, FileText, Award, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const { profile, user, isLoading } = useAuth();

  if (isLoading || !profile || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileHeader />
      
      <Tabs defaultValue="profile" className="w-full mt-8">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          
          {profile.role === 'freelancer' && (
            <>
              <TabsTrigger value="portfolio" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Experience & Certifications
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileDetails />
        </TabsContent>
        
        {profile.role === 'freelancer' && (
          <>
            <TabsContent value="portfolio">
              <Card>
                <CardContent className="p-6">
                  <FreelancerPortfolio />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience">
              <Card>
                <CardContent className="p-6">
                  <ExperienceCertifications />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <Button asChild variant="outline" className="mb-4">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Account Settings
                </Link>
              </Button>
              <p className="text-gray-600">Visit the settings page to manage your account preferences, security settings, and more.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
