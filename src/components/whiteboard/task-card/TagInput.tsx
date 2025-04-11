
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor="tags" className="text-sm font-medium flex items-center gap-1">
        <Tag size={14} /> Tags
      </label>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => onRemoveTag(tag)}>
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          id="tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <Button onClick={handleAddTag} size="sm">Add</Button>
      </div>
    </div>
  );
};

export default TagInput;
