
import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Section from './Section';
import CommentDialog from './CommentDialog';
import EditSectionDialog from './EditSectionDialog';
import AddSectionForm from './AddSectionForm';
import { ChecklistItem, Comment } from '@/types/task';

export interface ChecklistTabsProps {
  sections: Array<{id: string; title: string; items: ChecklistItem[]}>;
  onSectionsChange: (sections: Array<{id: string; title: string; items: ChecklistItem[]}>) => void;
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
    
    const newSection = {
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
                <Section 
                  key={section.id}
                  section={section}
                  index={index}
                  handleAddTask={handleAddTask}
                  handleDeleteTask={handleDeleteTask}
                  handleToggleTaskCompletion={handleToggleTaskCompletion}
                  handleUpdateTaskText={handleUpdateTaskText}
                  openEditDialog={openEditDialog}
                  handleDeleteSection={handleDeleteSection}
                  newTaskTexts={newTaskTexts}
                  setNewTaskTexts={setNewTaskTexts}
                  setSelectedTask={setSelectedTask}
                />
              ))}
              {provided.placeholder}
              
              <AddSectionForm 
                newSectionTitle={newSectionTitle}
                setNewSectionTitle={setNewSectionTitle}
                handleAddSection={handleAddSection}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <EditSectionDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editedSectionTitle={editedSectionTitle}
        setEditedSectionTitle={setEditedSectionTitle}
        handleEditSection={handleEditSection}
      />

      <CommentDialog 
        selectedTask={selectedTask}
        sections={sections}
        handleAddComment={onAddComment}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default ChecklistTabs;
