
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CollaborativeChecklist } from '@/components/dashboard/CollaborativeChecklist';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistTabsProps {
  todoItems: ChecklistItem[];
  inProgressItems: ChecklistItem[];
  doneItems: ChecklistItem[];
  onUpdateSection: (section: 'todoItems' | 'inProgressItems' | 'doneItems', items: ChecklistItem[]) => Promise<void>;
}

const ChecklistTabs: React.FC<ChecklistTabsProps> = ({
  todoItems,
  inProgressItems,
  doneItems,
  onUpdateSection
}) => {
  return (
    <Tabs defaultValue="todo" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="todo">To Do</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
      </TabsList>
      
      <TabsContent value="todo" className="space-y-4">
        <CollaborativeChecklist
          items={todoItems}
          onUpdate={(items) => onUpdateSection('todoItems', items)}
        />
      </TabsContent>
      
      <TabsContent value="in-progress" className="space-y-4">
        <CollaborativeChecklist
          items={inProgressItems}
          onUpdate={(items) => onUpdateSection('inProgressItems', items)}
        />
      </TabsContent>
      
      <TabsContent value="done" className="space-y-4">
        <CollaborativeChecklist
          items={doneItems}
          onUpdate={(items) => onUpdateSection('doneItems', items)}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChecklistTabs;
