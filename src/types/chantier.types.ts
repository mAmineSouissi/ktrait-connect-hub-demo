import type { ChantierStatus } from "./database.types";
import type {
  ChantierRow,
  ChantierTeamRow,
  ChantierPlanningRow,
  ChantierGalleryRow,
  ChantierNoteRow,
} from "./supabase-database.types";

/**
 * Chantier with related data counts
 */
export interface ChantierWithCounts extends ChantierRow {
  project?: {
    id: string;
    name: string;
    client_id: string;
  } | null;
  team_count?: number;
  planning_count?: number;
  gallery_count?: number;
  notes_count?: number;
}

/**
 * Chantier with full details (for detail page)
 */
export interface ChantierWithDetails extends ChantierRow {
  project: {
    id: string;
    name: string;
    client_id: string;
    client?: {
      id: string;
      full_name: string;
      email?: string;
    } | null;
  } | null;
  team: ChantierTeamRow[];
  planning: ChantierPlanningRow[];
  gallery: ChantierGalleryRow[];
  notes: ChantierNoteRow[];
}

/**
 * API Request/Response types
 */
export interface CreateChantierRequest {
  project_id: string;
  name: string;
  location: string;
  description?: string | null;
  status?: ChantierStatus;
  progress?: number;
  start_date?: string | null;
  end_date?: string | null;
}

export interface UpdateChantierRequest {
  project_id?: string;
  name?: string;
  location?: string;
  description?: string | null;
  status?: ChantierStatus;
  progress?: number;
  start_date?: string | null;
  end_date?: string | null;
}

export interface ChantierListResponse {
  chantiers: ChantierWithCounts[];
  total: number;
}

export interface ChantierDetailResponse {
  chantier: ChantierWithDetails;
}

/**
 * Chantier team member types
 */
export interface CreateChantierTeamRequest {
  chantier_id: string;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
}

export interface UpdateChantierTeamRequest {
  name?: string;
  role?: string;
  phone?: string | null;
  email?: string | null;
}

/**
 * Chantier planning/task types
 */
export interface CreateChantierPlanningRequest {
  chantier_id: string;
  task_name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
}

export interface UpdateChantierPlanningRequest {
  task_name?: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
}

/**
 * Chantier gallery types
 */
export interface CreateChantierGalleryRequest {
  chantier_id: string;
  title: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
}

export interface UpdateChantierGalleryRequest {
  title?: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
}

/**
 * Chantier note types
 */
export interface CreateChantierNoteRequest {
  chantier_id: string;
  author: string;
  content: string;
  date?: string;
}

export interface UpdateChantierNoteRequest {
  author?: string;
  content?: string;
  date?: string;
}
