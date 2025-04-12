
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Section from '../Section';
import AddSectionForm from '../AddSectionForm';
import { ChecklistItem } from '@/types/task';

export interface SectionListProps {
  sections: Array<{id: string; title: string; items: ChecklistItem[]}>;
  onSectionsChange: (sections: Array<{id: string; title: string; items: ChecklistItem[]}>) => void;
  handleAddTask: (sectionId: string) => void;
  handleDeleteTask: (sectionId: string, taskId: string) => void;
  handleToggleTaskCompletion: (sectionId: string, taskId: string, completed: boolean) => void;
  handleUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  openEditDialog: (sectionId: string, currentTitle: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  newTaskTexts: Record<string, string>;
  setNewTaskTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
  newSectionTitle: string;
  setNewSectionTitle: (title: string) => void;
  handleAddSection: () => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onSectionsChange,
  handleAddTask,
  handleDeleteTask,
  handleToggleTaskCompletion,
  handleUpdateTaskText,
  openEditDialog,
  handleDeleteSection,
  newTaskTexts,
  setNewTaskTexts,
  setSelectedTask,
  newSectionTitle,
  setNewSectionTitle,
  handleAddSection
}) => {
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

  return (
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
  );
};

export default SectionList;
