
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, UserCircle, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskCardProps {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
  subtasks?: SubTask[];
  onClose?: () => void;
  onSave?: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title = '',
  description = '',
  dueDate = '',
  assignee = '',
  tags = [],
  subtasks = [],
  onClose,
  onSave
}) => {
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description);
  const [taskDueDate, setTaskDueDate] = useState(dueDate);
  const [taskAssignee, setTaskAssignee] = useState(assignee);
  const [taskTags, setTaskTags] = useState<string[]>(tags);
  const [taskSubtasks, setTaskSubtasks] = useState<SubTask[]>(subtasks.length ? subtasks : [
    { id: '1', text: '', completed: false }
  ]);
  const [newTag, setNewTag] = useState('');
  
  const handleAddSubtask = () => {
    setTaskSubtasks([
      ...taskSubtasks,
      { id: Date.now().toString(), text: '', completed: false }
    ]);
  };
  
  const handleRemoveSubtask = (id: string) => {
    setTaskSubtasks(taskSubtasks.filter(task => task.id !== id));
  };
  
  const handleSubtaskChange = (id: string, text: string) => {
    setTaskSubtasks(taskSubtasks.map(task => 
      task.id === id ? { ...task, text } : task
    ));
  };
  
  const handleSubtaskToggle = (id: string, completed: boolean) => {
    setTaskSubtasks(taskSubtasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !taskTags.includes(newTag.trim())) {
      setTaskTags([...taskTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTaskTags(taskTags.filter(t => t !== tag));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        id: id || Date.now().toString(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        assignee: taskAssignee,
        tags: taskTags,
        subtasks: taskSubtasks.filter(task => task.text.trim())
      });
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          {id ? 'Edit Task' : 'New Task'}
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <Input
            id="title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Subtasks</label>
          <div className="space-y-2">
            {taskSubtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <Checkbox
                  id={`subtask-${subtask.id}`}
                  checked={subtask.completed}
                  onCheckedChange={(checked) => handleSubtaskToggle(subtask.id, !!checked)}
                />
                <Input
                  value={subtask.text}
                  onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                  placeholder="Subtask"
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveSubtask(subtask.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleAddSubtask}
            >
              Add Subtask
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-1">
              <Calendar size={14} /> Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="assignee" className="text-sm font-medium flex items-center gap-1">
              <UserCircle size={14} /> Assignee
            </label>
            <Input
              id="assignee"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              placeholder="Assigned to"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor="tags" className="text-sm font-medium flex items-center gap-1">
            <Tag size={14} /> Tags
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {taskTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          Save Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
