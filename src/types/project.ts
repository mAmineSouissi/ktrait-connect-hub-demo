import { ProjectStatus, StageStatus } from "./database.types";
import { Client, User } from "./user.types";

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  budget?: number;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  estimated_completion?: string;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "partner" | "viewer";
  can_edit: boolean;
  joined_at: string;
}

export interface ProjectStage {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: StageStatus;
  order_index: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface ProjectWithDetails extends Project {
  client: Client & { user: User };
  members: (ProjectMember & { user: User })[];
  stages: ProjectStage[];
  document_count?: number;
  unread_messages?: number;
}
