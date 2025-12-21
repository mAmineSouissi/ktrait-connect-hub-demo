/**
 * Chantiers and related tables types
 */
import type { ChantierStatus } from "../database.types";
import type { MediaTypeType } from "../enums/media-type.enum";

// ==================== CHANTIERS ====================
export interface ChantierRow {
  id: string;
  project_id: string;
  name: string;
  location: string;
  description?: string | null;
  status: ChantierStatus;
  progress: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChantierInsert {
  id?: string;
  project_id: string;
  name: string;
  location: string;
  description?: string | null;
  status?: ChantierStatus;
  progress?: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChantierUpdate {
  project_id?: string;
  name?: string;
  location?: string;
  description?: string | null;
  status?: ChantierStatus;
  progress?: number;
  start_date?: string | null;
  end_date?: string | null;
  updated_at?: string;
}

// ==================== CHANTIER TEAM ====================
export interface ChantierTeamRow {
  id: string;
  chantier_id: string;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChantierTeamInsert {
  id?: string;
  chantier_id: string;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChantierTeamUpdate {
  chantier_id?: string;
  name?: string;
  role?: string;
  phone?: string | null;
  email?: string | null;
  updated_at?: string;
}

// ==================== CHANTIER PLANNING ====================
export interface ChantierPlanningRow {
  id: string;
  chantier_id: string;
  task_name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ChantierPlanningInsert {
  id?: string;
  chantier_id: string;
  task_name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChantierPlanningUpdate {
  chantier_id?: string;
  task_name?: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
  updated_at?: string;
}

// ==================== CHANTIER GALLERY ====================
export interface ChantierGalleryRow {
  id: string;
  chantier_id: string;
  title: string;
  description?: string | null;
  media_type: MediaTypeType;
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChantierGalleryInsert {
  id?: string;
  chantier_id: string;
  title: string;
  description?: string | null;
  media_type?: MediaTypeType;
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChantierGalleryUpdate {
  chantier_id?: string;
  title?: string;
  description?: string | null;
  media_type?: MediaTypeType;
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
  updated_at?: string;
}

// ==================== CHANTIER NOTES ====================
export interface ChantierNoteRow {
  id: string;
  chantier_id: string;
  author: string;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ChantierNoteInsert {
  id?: string;
  chantier_id: string;
  author: string;
  content: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChantierNoteUpdate {
  chantier_id?: string;
  author?: string;
  content?: string;
  date?: string;
  updated_at?: string;
}
