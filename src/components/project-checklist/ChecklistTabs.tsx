
import React from 'react';
import SectionList from './sections/SectionList';
import CommentDialog from './CommentDialog';
import EditSectionDialog from './EditSectionDialog';
import { ChecklistItem, Comment } from '@/types/task';
import { useSectionManagement } from './hooks/useSectionManagement';

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
  const {
    newSectionTitle,
    setNewSectionTitle,
    newTaskTexts,
    setNewTaskTexts,
    selectedTask,
    setSelectedTask,
    editedSectionTitle,
    setEditedSectionTitle,
    isEditDialogOpen,
    setIsEditDialogOpen,
    openEditDialog,
    handleEditSection,
    handleDeleteSection,
    handleAddSection,
    handleAddTask,
    handleDeleteTask,
    handleToggleTaskCompletion,
    handleUpdateTaskText
  } = useSectionManagement({
    sections,
    onSectionsChange,
    onAddComment
  });

  return (
    <div className="h-full p-4 bg-gray-50">
      <SectionList
        sections={sections}
        onSectionsChange={onSectionsChange}
        handleAddTask={handleAddTask}
        handleDeleteTask={handleDeleteTask}
        handleToggleTaskCompletion={handleToggleTaskCompletion}
        handleUpdateTaskText={handleUpdateTaskText}
        openEditDialog={openEditDialog}
        handleDeleteSection={handleDeleteSection}
        newTaskTexts={newTaskTexts}
        setNewTaskTexts={setNewTaskTexts}
        setSelectedTask={setSelectedTask}
        newSectionTitle={newSectionTitle}
        setNewSectionTitle={setNewSectionTitle}
        handleAddSection={handleAddSection}
      />

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
