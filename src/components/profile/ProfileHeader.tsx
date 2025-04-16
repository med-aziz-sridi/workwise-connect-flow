import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from '@/components/ui/verification-badge';
import AvailabilityBadge from '@/components/ui/availability-badge';

const ProfileHeader: React.FC = () => {
  const { profile, isUpdating } = useAuth();
  
  if (!profile) return null;
  
  const isFreelancer = profile.role === 'freelancer';
  
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg overflow-hidden">
        {profile.cover_picture ? (
          <img
            src={profile.cover_picture}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-end sm:space-x-5">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
              {profile.profile_picture ? (
                <img 
                  src={profile.profile_picture} 
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0 sm:flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{profile.name}</h1>
              {profile.verified && <VerificationBadge />}
            </div>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1.5">
              {profile.role && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {profile.role === 'freelancer' ? 'Freelancer' : 'Job Provider'}
                </Badge>
              )}
              
              {isFreelancer && profile.available_until && (
                <AvailabilityBadge availableUntil={profile.available_until} />
              )}
              
              {profile.location && (
                <span className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {profile.location}
                </span>
              )}
              
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
              </span>

              {/* Rating display */}
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-4 w-4 ${star <= (profile.rating || 0) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {profile.rating?.toFixed(1) || "No ratings"} 
                  {profile.total_ratings ? ` (${profile.total_ratings})` : ""}
                </span>
              </div>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-gray-700">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
