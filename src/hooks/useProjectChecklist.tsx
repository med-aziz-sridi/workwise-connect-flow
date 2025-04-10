
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ProjectChecklistData {
  todoItems: ChecklistItem[];
  inProgressItems: ChecklistItem[];
  doneItems: ChecklistItem[];
}

interface UseProjectChecklistReturn {
  checklistData: ProjectChecklistData;
  isLoading: boolean;
  updateChecklistSection: (
    section: 'todoItems' | 'inProgressItems' | 'doneItems', 
    items: ChecklistItem[]
  ) => Promise<void>;
}

export const useProjectChecklist = (projectId?: string): UseProjectChecklistReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [checklistData, setChecklistData] = useState<ProjectChecklistData>({
    todoItems: [],
    inProgressItems: [],
    doneItems: []
  });

  useEffect(() => {
    if (!projectId) return;
    
    const fetchChecklistData = async () => {
      try {
        // Use a cast to handle type issues with the project_checklists table
        const { data: checklistData, error } = await supabase
          .from('project_checklists')
          .select('*')
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (!error && checklistData) {
          setChecklistData({
            todoItems: checklistData.todo_items || [],
            inProgressItems: checklistData.in_progress_items || [],
            doneItems: checklistData.done_items || []
          });
        } else {
          // Initialize with empty arrays if no data exists
          setChecklistData({
            todoItems: [],
            inProgressItems: [],
            doneItems: []
          });
        }
      } catch (error) {
        console.error('Error fetching checklist data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChecklistData();
  }, [projectId]);

  const updateChecklistSection = async (
    section: 'todoItems' | 'inProgressItems' | 'doneItems',
    items: ChecklistItem[]
  ) => {
    if (!projectId) return;
    
    // Update local state
    setChecklistData(prev => ({
      ...prev,
      [section]: items
    }));
    
    try {
      // Prepare data for database update
      const updateData: Record<string, any> = {};
      
      if (section === 'todoItems') {
        updateData.todo_items = items;
      } else if (section === 'inProgressItems') {
        updateData.in_progress_items = items;
      } else if (section === 'doneItems') {
        updateData.done_items = items;
      }
      
      // Check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('project_checklists')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('project_checklists')
          .update(updateData)
          .eq('project_id', projectId);
          
        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('project_checklists')
          .insert({
            project_id: projectId,
            ...updateData
          } as any);
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  return {
    checklistData,
    isLoading,
    updateChecklistSection
  };
};
