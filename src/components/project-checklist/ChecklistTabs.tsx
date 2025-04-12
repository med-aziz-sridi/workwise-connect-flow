
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, MoreVertical, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  comments: Comment[];
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistTabsProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onAddComment: (sectionId: string, taskId: string, comment: Comment) => void;
}

const ChecklistTabs: React.FC<ChecklistTabsProps> = ({
  sections = [],
  onSectionsChange,
  onAddComment,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});
  const [selectedTask, setSelectedTask] = useState<{ sectionId: string; taskId: string } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editedSectionTitle, setEditedSectionTitle] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !sections) return;

    const { source, destination, type } = result;

    if (type === 'SECTION') {
      const reorderedSections = [...sections];
      const [movedSection] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, movedSection);
      onSectionsChange(reorderedSections);
    } else if (type === 'TASK') {
      const sourceSectionIndex = sections.findIndex(s => s.id === source.droppableId);
      const destSectionIndex = sections.findIndex(s => s.id === destination.droppableId);
      
      if (sourceSectionIndex === -1 || destSectionIndex === -1) return;

      // Handle same-section movement
      if (source.droppableId === destination.droppableId) {
        const sectionCopy = { ...sections[sourceSectionIndex] };
        const items = [...sectionCopy.items];
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        const newSections = [...sections];
        newSections[sourceSectionIndex] = { ...sectionCopy, items };
        onSectionsChange(newSections);
      } else {
        // Handle cross-section movement
        const sourceSection = { ...sections[sourceSectionIndex] };
        const destSection = { ...sections[destSectionIndex] };
        
        const task = sourceSection.items[source.index];
        if (!task) return;

        const newSourceItems = [...sourceSection.items];
        newSourceItems.splice(source.index, 1);
        
        const newDestItems = [...destSection.items];
        newDestItems.splice(destination.index, 0, task);

        const newSections = [...sections];
        newSections[sourceSectionIndex] = { ...sourceSection, items: newSourceItems };
        newSections[destSectionIndex] = { ...destSection, items: newDestItems };
        onSectionsChange(newSections);
      }
    }
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionTitle,
      items: [],
    };
    const updatedSections = [...sections, newSection];
    onSectionsChange(updatedSections);
    setNewSectionTitle('');
  };
  
  const openEditDialog = (sectionId: string, currentTitle: string) => {
    setEditingSectionId(sectionId);
    setEditedSectionTitle(currentTitle);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSection = () => {
    if (!editingSectionId || !editedSectionTitle.trim()) return;
    
    const updatedSections = sections.map(section => 
      section.id === editingSectionId ? { ...section, title: editedSectionTitle } : section
    );
    onSectionsChange(updatedSections);
    setIsEditDialogOpen(false);
    setEditingSectionId(null);
    setEditedSectionTitle('');
  };
  
  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
  };

  const handleAddTask = (sectionId: string) => {
    const text = newTaskTexts[sectionId]?.trim();
    if (!text) return;
    
    const newTask: ChecklistItem = {
      id: `task-${Date.now()}`,
      text,
      comments: [],
      completed: false
    };
    
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, newTask] }
        : section
    );
    onSectionsChange(updatedSections);
    setNewTaskTexts({ ...newTaskTexts, [sectionId]: '' });
  };

  const handleCommentSubmit = () => {
    if (!selectedTask || !newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      author: 'Current User',
      createdAt: new Date(),
    };

    onAddComment(selectedTask.sectionId, selectedTask.taskId, comment);
    setNewComment('');
  };

  const handleDeleteTask = (sectionId: string, taskId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== taskId) }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const handleToggleTaskCompletion = (sectionId: string, taskId: string, completed: boolean) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === taskId ? { ...item, completed } : item
            ) 
          }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const handleUpdateTaskText = (sectionId: string, taskId: string, text: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === taskId ? { ...item, text } : item
            ) 
          }
        : section
    );
    onSectionsChange(updatedSections);
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" direction="horizontal" type="SECTION">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 overflow-x-auto pb-4"
              aria-label="Checklist sections"
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow-sm w-72 flex-shrink-0"
                      role="group"
                      aria-label={`Section: ${section.title}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-4 font-semibold border-b flex justify-between items-center"
                      >
                        <span>{section.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="Section options"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(section.id, section.title)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSection(section.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <Droppable droppableId={section.id} type="TASK">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-2 min-h-[100px]"
                          >
                            {section.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-3 mb-2 rounded shadow hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start gap-2">
                                      <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={(e) => handleToggleTaskCompletion(section.id, item.id, e.target.checked)}
                                        className="mt-1"
                                      />
                                      <div className="flex-1">
                                        <input
                                          value={item.text}
                                          onChange={(e) => handleUpdateTaskText(section.id, item.id, e.target.value)}
                                          className={`w-full bg-transparent border-none p-0 focus:ring-0 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                                        />
                                        {item.comments.length > 0 && (
                                          <div 
                                            className="text-sm text-gray-500 mt-1 cursor-pointer"
                                            onClick={() => setSelectedTask({ sectionId: section.id, taskId: item.id })}
                                          >
                                            {item.comments.length} 💬
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleDeleteTask(section.id, item.id)}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete task"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            <div className="mt-2">
                              <div className="flex gap-2">
                                <Input
                                  value={newTaskTexts[section.id] || ''}
                                  onChange={(e) => setNewTaskTexts({ 
                                    ...newTaskTexts, 
                                    [section.id]: e.target.value 
                                  })}
                                  placeholder="Add a task"
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask(section.id)}
                                  aria-label="Add new task input"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAddTask(section.id)}
                                  aria-label="Add task button"
                                  disabled={!newTaskTexts[section.id]?.trim()}
                                >
                                  <PlusCircle size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
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
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Section Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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

      {/* Comment Modal */}
      {selectedTask && (
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
      )}
    </div>
  );
};

export default ChecklistTabs;
