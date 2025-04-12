
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface EditSectionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editedSectionTitle: string;
  setEditedSectionTitle: (title: string) => void;
  handleEditSection: () => void;
}

const EditSectionDialog: React.FC<EditSectionDialogProps> = ({
  isOpen,
  setIsOpen,
  editedSectionTitle,
  setEditedSectionTitle,
  handleEditSection
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={editedSectionTitle}
            onChange={(e) => setEditedSectionTitle(e.target.value)}
            placeholder="Section title"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditSection();
              }
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleEditSection}
            disabled={!editedSectionTitle.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSectionDialog;
