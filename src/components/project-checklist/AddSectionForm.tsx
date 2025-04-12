
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddSectionFormProps {
  newSectionTitle: string;
  setNewSectionTitle: (title: string) => void;
  handleAddSection: () => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({
  newSectionTitle,
  setNewSectionTitle,
  handleAddSection
}) => {
  return (
    <div className="bg-white/50 p-4 rounded-lg w-72 flex-shrink-0">
      <div className="flex gap-2">
        <Input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="New section title"
          onKeyPress={(e) => e.key === 'Enter' && newSectionTitle.trim() && handleAddSection()}
          aria-label="Add new section input"
        />
        <Button 
          size="sm"
          onClick={handleAddSection}
          aria-label="Add section button"
          disabled={!newSectionTitle.trim()}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AddSectionForm;
