
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Pencil, Trash2, MoreVertical, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TaskItem from './TaskItem';
import { ChecklistItem } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SectionProps {
  section: {
    id: string;
    title: string;
    items: ChecklistItem[];
  };
  index: number;
  handleAddTask: (sectionId: string) => void;
  handleDeleteTask: (sectionId: string, taskId: string) => void;
  handleToggleTaskCompletion: (sectionId: string, taskId: string, completed: boolean) => void;
  handleUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  openEditDialog: (sectionId: string, currentTitle: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  newTaskTexts: Record<string, string>;
  setNewTaskTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  index,
  handleAddTask,
  handleDeleteTask,
  handleToggleTaskCompletion,
  handleUpdateTaskText,
  openEditDialog,
  handleDeleteSection,
  newTaskTexts,
  setNewTaskTexts,
  setSelectedTask,
}) => {
  return (
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
          
          <TaskList 
            section={section} 
            handleDeleteTask={handleDeleteTask}
            handleToggleTaskCompletion={handleToggleTaskCompletion}
            handleUpdateTaskText={handleUpdateTaskText}
            setSelectedTask={setSelectedTask}
          />
          
          <div className="mt-2 p-2">
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
    </Draggable>
  );
};

interface TaskListProps {
  section: {
    id: string;
    items: ChecklistItem[];
  };
  handleDeleteTask: (sectionId: string, taskId: string) => void;
  handleToggleTaskCompletion: (sectionId: string, taskId: string, completed: boolean) => void;
  handleUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  section,
  handleDeleteTask,
  handleToggleTaskCompletion,
  handleUpdateTaskText,
  setSelectedTask
}) => {
  return (
    <div className="p-2 min-h-[100px]">
      {section.items.map((item, taskIndex) => (
        <TaskItem
          key={item.id}
          item={item}
          taskIndex={taskIndex}
          sectionId={section.id}
          handleDeleteTask={handleDeleteTask}
          handleToggleTaskCompletion={handleToggleTaskCompletion}
          handleUpdateTaskText={handleUpdateTaskText}
          setSelectedTask={setSelectedTask}
        />
      ))}
    </div>
  );
};

export default Section;
