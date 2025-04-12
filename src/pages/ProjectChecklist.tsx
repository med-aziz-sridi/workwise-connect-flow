
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProjectInfo from '@/components/project-checklist/ProjectInfo';
import ChecklistTabs from '@/components/project-checklist/ChecklistTabs';
import { ChecklistItem, Comment } from '@/types/task';
import { useProjectChecklist } from '@/hooks/useProjectChecklist';

const ProjectChecklist: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs } = useData();
  const [project, setProject] = useState<any>(null);
  
  const { 
    checklistData,
    isLoading,
    updateChecklistSection
  } = useProjectChecklist(projectId);

  const [sections, setSections] = useState<Array<{id: string; title: string; items: ChecklistItem[]}>>([
    { id: 'todo', title: 'To Do', items: [] },
    { id: 'in-progress', title: 'In Progress', items: [] },
    { id: 'done', title: 'Done', items: [] },
  ]);

  // Initialize sections from checklistData
  useEffect(() => {
    if (checklistData) {
      setSections([
        { id: 'todo', title: 'To Do', items: checklistData.todoItems },
        { id: 'in-progress', title: 'In Progress', items: checklistData.inProgressItems },
        { id: 'done', title: 'Done', items: checklistData.doneItems },
      ]);
    }
  }, [checklistData]);

  useEffect(() => {
    if (!projectId || !user) return;
    
    const fetchProject = async () => {
      try {
        // Find the job in our existing data
        const foundProject = jobs.find(job => job.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    
    fetchProject();
  }, [projectId, user, jobs]);

  const handleSectionsChange = (updatedSections: Array<{id: string; title: string; items: ChecklistItem[]}>) => {
    setSections(updatedSections);
    
    // Map back to the original format for the hook
    const todoItems = updatedSections.find(s => s.id === 'todo')?.items || [];
    const inProgressItems = updatedSections.find(s => s.id === 'in-progress')?.items || [];
    const doneItems = updatedSections.find(s => s.id === 'done')?.items || [];
    
    updateChecklistSection('todoItems', todoItems);
    updateChecklistSection('inProgressItems', inProgressItems);
    updateChecklistSection('doneItems', doneItems);
  };

  const handleAddComment = (sectionId: string, taskId: string, comment: Comment) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === taskId) {
              return {
                ...item,
                comments: [...item.comments, comment]
              };
            }
            return item;
          })
        };
      }
      return section;
    });
    
    handleSectionsChange(updatedSections);
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
      <ProjectInfo projectId={projectId} projectTitle={project.title} />
      
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Project Checklist</CardTitle>
          <CardDescription>
            Track project progress together with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChecklistTabs
            sections={sections}
            onSectionsChange={handleSectionsChange}
            onAddComment={handleAddComment}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectChecklist;
