
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Pencil, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { AvailabilityBadge } from '@/components/ui/availability-badge';

const ProfileHeader: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!user || !profile) return null;

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string" || name.trim().length === 0) return "U";
    return name
      .trim()
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    setIsUploading(true);
    try {
      // Create bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('profiles');
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('profiles', {
          public: true,
        });
      }

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      if (type === 'avatar') {
        await updateProfile({ profile_picture: publicURL.publicUrl });
        setIsEditingAvatar(false);
      } else {
        await updateProfile({ cover_picture: publicURL.publicUrl });
        setIsEditingBanner(false);
      }

      toast.success(`${type === 'avatar' ? 'Profile picture' : 'Cover image'} updated`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload ${type === 'avatar' ? 'profile picture' : 'cover image'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-100 to-blue-200 relative">
        {profile.cover_picture && (
          <img 
            src={profile.cover_picture} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-4 right-4"
          onClick={() => setIsEditingBanner(!isEditingBanner)}
        >
          <Camera className="h-4 w-4 mr-2" />
          Change Cover
        </Button>
        
        {isEditingBanner && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
              <h3 className="font-medium mb-2">Upload Cover Image</h3>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, 'banner')}
                disabled={isUploading}
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingBanner(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Profile Picture */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg ring-4 ring-white/10">
              <AvatarImage 
                src={profile.profile_picture || undefined} 
                alt={profile.name} 
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            
            <div className="absolute -bottom-2 -right-2 flex space-x-1 bg-white rounded-full p-1 shadow-md">
              {profile.verified && <VerificationBadge size="sm" />}
              {profile.role === 'freelancer' && <AvailabilityBadge size="sm" />}
            </div>
            
            <Button 
              variant="secondary" 
              size="icon"
              className="absolute top-0 right-0 h-8 w-8 shadow-md"
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {isEditingAvatar && (
            <div className="absolute top-full mt-4 bg-white p-3 rounded-lg shadow-lg z-10 w-64">
              <h3 className="font-medium mb-2">Update Profile Picture</h3>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, 'avatar')}
                disabled={isUploading}
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingAvatar(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer for profile picture overflow */}
      <div className="h-24"></div>
    </div>
  );
};

export default ProfileHeader;
