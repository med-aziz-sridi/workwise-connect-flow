
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState('');
  const [role, setRole] = useState('');
  const { addProject } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addProject({
        title,
        description,
        images,
        technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
        role
      });
      toast({
        title: "Project added",
        description: "Your project has been added successfully",
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technologies" className="text-right">
              Technologies
            </Label>
            <Input 
              id="technologies" 
              value={technologies} 
              onChange={(e) => setTechnologies(e.target.value)} 
              placeholder="React, TypeScript, Node.js (comma separated)" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Your Role
            </Label>
            <Input 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              placeholder="Frontend Developer, UI Designer, etc." 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="images" className="text-right">
              Images
            </Label>
            <div className="col-span-3">
              <ImageUpload value={images} onChange={setImages} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
