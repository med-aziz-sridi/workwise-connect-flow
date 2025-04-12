
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChecklistItem, Comment } from '@/types/task';

interface CommentDialogProps {
  selectedTask: { sectionId: string; taskId: string } | null;
  sections: Array<{id: string; title: string; items: ChecklistItem[]}>;
  handleAddComment: (sectionId: string, taskId: string, comment: Comment) => void;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  selectedTask,
  sections,
  handleAddComment,
  setSelectedTask
}) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (!selectedTask || !newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      author: 'Current User',
      createdAt: new Date(),
    };

    handleAddComment(selectedTask.sectionId, selectedTask.taskId, comment);
    setNewComment('');
  };

  if (!selectedTask) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setSelectedTask(null)}
      role="dialog"
      aria-label="Task comments dialog"
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Task Comments</h3>
        <div className="max-h-96 overflow-y-auto mb-4">
          {sections
            .find(s => s.id === selectedTask.sectionId)
            ?.items.find(t => t.id === selectedTask.taskId)
            ?.comments.map(comment => (
              <div 
                key={comment.id} 
                className="mb-4 p-3 bg-gray-50 rounded"
                aria-label="Comment"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            onKeyPress={(e) => e.key === 'Enter' && newComment.trim() && handleCommentSubmit()}
            aria-label="Write comment input"
          />
          <Button 
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            aria-label="Add comment button"
          >
            Add
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedTask(null)}
            aria-label="Close comments button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
