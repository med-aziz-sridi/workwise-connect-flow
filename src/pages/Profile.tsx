
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import FreelancerPortfolio from '@/components/profile/FreelancerPortfolio';
import { Card } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading || !profile) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="overflow-hidden">
        <ProfileHeader />
        <ProfileDetails />
        
        {profile.role === 'freelancer' && (
          <FreelancerPortfolio />
        )}
      </Card>
    </div>
  );
};

export default Profile;
