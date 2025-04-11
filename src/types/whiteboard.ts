
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
  section?: string;
  subtasks?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface WhiteboardSection {
  id: string;
  title: string;
  color: string;
  textColor: string;
  tasks: TaskCardData[];
}

// Define the raw SQL query response types for better type safety
export interface WhiteboardQueryResponse {
  data: WhiteboardData | null;
  error: any;
}

export interface WhiteboardIdQueryResponse {
  data: { id: string } | null;
  error: any;
}

export interface WhiteboardMutationResponse {
  error: any;
}
