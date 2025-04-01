
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Plus, X, Check, UserCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const COMMON_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'UI/UX', 'Figma', 'Adobe XD', 
  'Sketch', 'WordPress', 'PHP', 'CSS', 'JavaScript', 'Mobile Design', 'iOS', 'Android',
  'Payment API', 'Python', 'Java', 'C#', 'Ruby', 'Docker', 'AWS', 'Azure', 'GraphQL',
  'SQL', 'NoSQL', 'Firebase', 'Vue.js', 'Angular', 'Express'
];

const ProfileDetails: React.FC = () => {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const skillSearchRef = useRef<HTMLDivElement>(null);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (skillSearchRef.current && !skillSearchRef.current.contains(event.target as Node)) {
        setIsSkillDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!profile || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (skill: string = newSkill.trim()) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, skill] 
      }));
      setNewSkill('');
      setSkillSearchTerm('');
      toast.success(`Added skill: ${skill}`);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(s => s !== skill) 
    }));
    toast.success(`Removed skill: ${skill}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
      setIsSkillDropdownOpen(false);
    } else if (e.key === 'Escape') {
      setIsSkillDropdownOpen(false);
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

  const filteredSkills = COMMON_SKILLS.filter(
    skill => 
      skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) && 
      !formData.skills.includes(skill)
  );

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
              <AvatarImage src={profile.profile_picture} alt={profile.name} />
              <AvatarFallback className="text-2xl bg-blue-600 text-white">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="font-bold text-xl mb-1"
                />
              ) : (
                <h2 className="text-2xl font-bold">{profile.name}</h2>
              )}
              <Badge variant="outline" className="capitalize mt-1">
                {profile.role}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant={isEditing ? "outline" : "default"}
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
        
        <div className="space-y-6 mt-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell others about yourself..."
                className="h-32 mb-4"
              />
            ) : (
              <p className="text-gray-700 mb-4 min-h-[4rem] p-2 bg-gray-50 rounded-md">
                {profile.bio || 'No bio provided yet.'}
              </p>
            )}
          </div>
          
          {profile.role === 'freelancer' && (
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              
              {isEditing && (
                <div className="relative mb-4" ref={skillSearchRef}>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Input
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          setSkillSearchTerm(e.target.value);
                          setIsSkillDropdownOpen(true);
                        }}
                        placeholder="Search or add a skill..."
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsSkillDropdownOpen(true)}
                        className="pr-8"
                      />
                      <Search className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                    </div>
                    <Button type="button" onClick={() => handleAddSkill()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isSkillDropdownOpen && skillSearchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                          <div 
                            key={skill} 
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              handleAddSkill(skill);
                              setIsSkillDropdownOpen(false);
                            }}
                          >
                            {skill}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          {newSkill.trim() ? 
                            `Press Enter to add "${newSkill.trim()}"` : 
                            'No matching skills found'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center text-sm py-1.5">
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
            <Button onClick={handleSubmit} className="mt-6 w-full">
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
