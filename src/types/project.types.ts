import { ProjectStatus, StageStatus } from "./database.types";

/**
 * Project type matching the public.projects table schema
 */
export interface Project {
  id: string;
  client_id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress: number; // 0-100
  estimated_budget?: number | null;
  spent_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
  // Client info (populated by API)
  client?: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  } | null;
}

/**
 * Project Phase type matching the public.project_phases table schema
 */
export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description?: string | null;
  status: StageStatus;
  progress_percentage: number; // 0-100
  order_index: number;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Project Partner relationship
 */
export interface ProjectPartner {
  id: string;
  project_id: string;
  partner_id: string;
  role?: string | null;
  is_primary: boolean;
  created_at: string;
}

/**
 * Project with related data
 */
export interface ProjectWithDetails extends Project {
  phases?: ProjectPhase[];
  partners?: ProjectPartner[];
  documents_count?: number;
  expenses_total?: number;
  payments_total?: number;
  // Client is already in Project base type, but ensure it's available
  client: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  } | null;
}
