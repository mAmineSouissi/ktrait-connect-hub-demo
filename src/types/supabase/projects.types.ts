/**
 * Projects, Project Phases, and Project Partners table types
 */
import type { ProjectStatus, StageStatus } from "../database.types";
import type { ProjectCategoryType } from "../enums/project-category.enum";
import type { ProjectTypeType } from "../enums/project-type.enum";

// ==================== PROJECTS ====================
export interface ProjectRow {
  id: string;
  client_id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress: number;
  estimated_budget?: number | null;
  spent_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  category?: ProjectCategoryType | null;
  type?: ProjectTypeType | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  client_id: string;
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  progress?: number;
  estimated_budget?: number | null;
  spent_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  category?: ProjectCategoryType | null;
  type?: ProjectTypeType | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectUpdate {
  client_id?: string;
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  progress?: number;
  estimated_budget?: number | null;
  spent_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  category?: ProjectCategoryType | null;
  type?: ProjectTypeType | null;
  updated_at?: string;
}

// ==================== PROJECT PHASES ====================
export interface ProjectPhaseRow {
  id: string;
  project_id: string;
  name: string;
  description?: string | null;
  status: StageStatus;
  progress_percentage: number;
  order_index: number;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectPhaseInsert {
  id?: string;
  project_id: string;
  name: string;
  description?: string | null;
  status?: StageStatus;
  progress_percentage?: number;
  order_index: number;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectPhaseUpdate {
  project_id?: string;
  name?: string;
  description?: string | null;
  status?: StageStatus;
  progress_percentage?: number;
  order_index?: number;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string;
}

// ==================== PROJECT PARTNERS ====================
export interface ProjectPartnerRow {
  id: string;
  project_id: string;
  partner_id: string;
  role?: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface ProjectPartnerInsert {
  id?: string;
  project_id: string;
  partner_id: string;
  role?: string | null;
  is_primary?: boolean;
  created_at?: string;
}

export interface ProjectPartnerUpdate {
  project_id?: string;
  partner_id?: string;
  role?: string | null;
  is_primary?: boolean;
}
