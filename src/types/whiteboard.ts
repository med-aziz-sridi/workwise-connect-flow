
export interface WhiteboardData {
  id: string;
  project_id: string;
  canvas_json: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
  subtasks?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}
