
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, X } from 'lucide-react';

const ProfileDetails: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  if (!profile) return null;

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
    await updateProfile({
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills,
    });
    setIsEditing(false);
  };

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-2xl font-bold mb-1"
            />
          ) : (
            <h1 className="text-2xl font-bold">{profile.name}</h1>
          )}
          <p className="text-gray-600 capitalize">{profile.role}</p>
        </div>
        
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
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        {isEditing ? (
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="h-32"
          />
        ) : (
          <p className="text-gray-700">
            {profile.bio || 'No bio provided yet.'}
          </p>
        )}
      </div>
      
      {profile.role === 'freelancer' && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          
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
        <Button onClick={handleSubmit}>Save Changes</Button>
      )}
    </div>
  );
};

export default ProfileDetails;
