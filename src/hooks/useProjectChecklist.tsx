import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { ChecklistItem, Comment } from '@/types/task';

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

// Helper function to safely convert Json data to ChecklistItem
const convertJsonToChecklistItems = (jsonData: Json | null): ChecklistItem[] => {
  if (!jsonData || !Array.isArray(jsonData)) {
    return [];
  }
  
  // Map and validate each item, making sure to properly convert comments
  return jsonData.map(item => {
    // Ensure the item has the required properties
    if (typeof item === 'object' && item !== null && 
        'id' in item && 'text' in item) {
      
      // Convert comments from Json to proper Comment objects
      let comments: Comment[] = [];
      if (Array.isArray(item.comments)) {
        comments = item.comments.map((comment: any) => ({
          id: String(comment.id || `generated-${Date.now()}`),
          text: String(comment.text || ''),
          author: String(comment.author || 'Unknown'),
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
        }));
      }
      
      return {
        id: String(item.id),
        text: String(item.text),
        completed: 'completed' in item ? Boolean(item.completed) : false,
        comments: comments
      };
    }
    
    // Return a default item if data is malformed
    console.warn('Malformed checklist item:', item);
    return {
      id: `generated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: 'Unnamed item',
      completed: false,
      comments: []
    };
  });
};

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
        const { data: checklistData, error } = await supabase
          .from('project_checklists')
          .select('*')
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (!error && checklistData) {
          // Safely convert the JSON data to ChecklistItem[] using our helper function
          const todoItems = convertJsonToChecklistItems(checklistData.todo_items);
          const inProgressItems = convertJsonToChecklistItems(checklistData.in_progress_items);
          const doneItems = convertJsonToChecklistItems(checklistData.done_items);
          
          setChecklistData({
            todoItems,
            inProgressItems,
            doneItems
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
