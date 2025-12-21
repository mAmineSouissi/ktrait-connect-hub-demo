/**
 * Project types
 *
 * These extend database schema types (from types/supabase/) with application-specific fields.
 */

import type { ProjectRow } from "./supabase/projects.types";
import type { ProjectPhaseRow } from "./supabase/projects.types";
import type { ProjectPartnerRow } from "./supabase/projects.types";

/**
 * Project type - extends ProjectRow with optional client info (populated by API)
 */
export interface Project extends ProjectRow {
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
 * Project Phase - alias for ProjectPhaseRow
 */
export type { ProjectPhaseRow as ProjectPhase } from "./supabase/projects.types";

/**
 * Project Partner - alias for ProjectPartnerRow
 */
export type { ProjectPartnerRow as ProjectPartner } from "./supabase/projects.types";

/**
 * Project with related data
 */
export interface ProjectWithDetails extends Project {
  phases?: ProjectPhaseRow[];
  partners?: ProjectPartnerRow[];
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
