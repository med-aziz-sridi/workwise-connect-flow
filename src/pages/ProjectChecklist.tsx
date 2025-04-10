import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CollaborativeChecklist } from '@/components/dashboard/CollaborativeChecklist';
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

// Define the interface for the response from the database
interface ProjectChecklistRecord {
  id: string;
  project_id: string;
  todo_items: ChecklistItem[];
  in_progress_items: ChecklistItem[];
  done_items: ChecklistItem[];
  created_at?: string;
  updated_at?: string;
}

const ProjectChecklist: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [checklistData, setChecklistData] = useState<ProjectChecklistData>({
    todoItems: [],
    inProgressItems: [],
    doneItems: []
  });

  useEffect(() => {
    if (!projectId || !user) return;
    
    const fetchProject = async () => {
      try {
        // Find the job in our existing data
        const foundProject = jobs.find(job => job.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        }
        
        // Fetch checklist data using a raw query since project_checklists isn't in the types
        const { data: checklistData, error } = await supabase
          .from('project_checklists')
          .select('*')
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (!error && checklistData) {
          // Cast the data to our expected type
          const typedData = checklistData as unknown as ProjectChecklistRecord;
          setChecklistData({
            todoItems: typedData.todo_items || [],
            inProgressItems: typedData.in_progress_items || [],
            doneItems: typedData.done_items || []
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
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, user, jobs]);

  const updateChecklistSection = async (section: 'todoItems' | 'inProgressItems' | 'doneItems', items: ChecklistItem[]) => {
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
      
      // Check if record exists using a raw query
      const { data: existingRecord, error: checkError } = await supabase
        .from('project_checklists')
        .select('id')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRecord) {
        // Update existing record using a raw query
        const { error: updateError } = await supabase
          .from('project_checklists')
          .update(updateData)
          .eq('project_id', projectId);
          
        if (updateError) throw updateError;
      } else {
        // Create new record using a raw query
        const { error: insertError } = await supabase
          .from('project_checklists')
          .insert({
            project_id: projectId,
            ...updateData
          });
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-gray-600 mt-1">Project Checklist</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/project/${projectId}/chat`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Project Chat
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Project Checklist</CardTitle>
          <CardDescription>
            Track project progress together with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todo" className="space-y-4">
              <CollaborativeChecklist
                items={checklistData.todoItems}
                onUpdate={(items) => updateChecklistSection('todoItems', items)}
              />
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              <CollaborativeChecklist
                items={checklistData.inProgressItems}
                onUpdate={(items) => updateChecklistSection('inProgressItems', items)}
              />
            </TabsContent>
            
            <TabsContent value="done" className="space-y-4">
              <CollaborativeChecklist
                items={checklistData.doneItems}
                onUpdate={(items) => updateChecklistSection('doneItems', items)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectChecklist;
