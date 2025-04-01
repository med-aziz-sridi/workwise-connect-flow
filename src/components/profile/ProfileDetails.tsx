
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Plus, X, Check, UserCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const ProfileDetails: React.FC = () => {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  if (!profile || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, newSkill.trim()] 
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(s => s !== skill) 
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string" || name.trim().length === 0) return "U";
    return name
      .trim()
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <UserCircle className="h-5 w-5 mr-2" />
              Profile Information
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (isEditing) {
                  // Reset form data if cancelling
                  setFormData({
                    name: profile.name || '',
                    bio: profile.bio || '',
                    skills: profile.skills || [],
                  });
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mb-4"
                />
              ) : (
                <p className="text-gray-900 mb-4">{profile.name || 'No name provided'}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Badge variant="outline" className="capitalize mb-4">
                {profile.role}
              </Badge>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="h-32 mb-4"
                />
              ) : (
                <p className="text-gray-700 mb-4">
                  {profile.bio || 'No bio provided yet.'}
                </p>
              )}
            </div>
            
            {profile.role === 'freelancer' && (
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                
                {isEditing && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyDown={handleKeyDown}
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {formData.skills && formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {skill}
                        {isEditing && (
                          <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet.</p>
                  )}
                </div>
              </div>
            )}
            
            {isEditing && (
              <Button onClick={handleSubmit} className="mt-4 w-full">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Profile Preview
          </h2>
          
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback className="text-xl bg-blue-600 text-white">{getInitials(isEditing ? formData.name : profile.name)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{isEditing ? formData.name : profile.name}</h1>
            <p className="text-gray-600 capitalize">{profile.role}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <p className="text-gray-700">
              {isEditing ? formData.bio || 'No bio provided yet.' : profile.bio || 'No bio provided yet.'}
            </p>
          </div>
          
          {profile.role === 'freelancer' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? formData.skills : profile.skills)?.length > 0 ? (
                  (isEditing ? formData.skills : profile.skills).map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
