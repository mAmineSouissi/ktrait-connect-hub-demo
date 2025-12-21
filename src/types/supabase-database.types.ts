/**
 * Supabase Database Types
 *
 * This file contains type definitions for all database tables.
 * These types match the actual database schema and are used for type-safe Supabase queries.
 */

import type { ProjectStatus, StageStatus, UserRole } from "./database.types";

/**
 * Database table row types
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      clients: {
        Row: ClientRow;
        Insert: ClientInsert;
        Update: ClientUpdate;
      };
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      project_phases: {
        Row: ProjectPhaseRow;
        Insert: ProjectPhaseInsert;
        Update: ProjectPhaseUpdate;
      };
      project_partners: {
        Row: ProjectPartnerRow;
        Insert: ProjectPartnerInsert;
        Update: ProjectPartnerUpdate;
      };
      partners: {
        Row: PartnerRow;
        Insert: PartnerInsert;
        Update: PartnerUpdate;
      };
      partners_profile: {
        Row: PartnerProfileRow;
        Insert: PartnerProfileInsert;
        Update: PartnerProfileUpdate;
      };
      documents: {
        Row: DocumentRow;
        Insert: DocumentInsert;
        Update: DocumentUpdate;
      };
      payments: {
        Row: PaymentRow;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      expenses: {
        Row: ExpenseRow;
        Insert: ExpenseInsert;
        Update: ExpenseUpdate;
      };
      project_gallery: {
        Row: ProjectGalleryRow;
        Insert: ProjectGalleryInsert;
        Update: ProjectGalleryUpdate;
      };
      partner_certifications: {
        Row: PartnerCertificationRow;
        Insert: PartnerCertificationInsert;
        Update: PartnerCertificationUpdate;
      };
      partner_personal_projects: {
        Row: PartnerPersonalProjectRow;
        Insert: PartnerPersonalProjectInsert;
        Update: PartnerPersonalProjectUpdate;
      };
      partner_gallery: {
        Row: PartnerGalleryRow;
        Insert: PartnerGalleryInsert;
        Update: PartnerGalleryUpdate;
      };
    };
  };
}

// ==================== USERS ====================
export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  email_verified: boolean;
  role: UserRole;
  approval_status?: "pending" | "approved" | "rejected" | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
  role?: UserRole;
  approval_status?: "pending" | "approved" | "rejected" | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  updated_at?: string;
}

// ==================== CLIENTS ====================
export interface ClientRow {
  id: string;
  user_id: string;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientInsert {
  id?: string;
  user_id: string;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientUpdate {
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  updated_at?: string;
}

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

// ==================== PARTNERS ====================
export interface PartnerRow {
  id: string;
  name: string;
  type:
    | "architecte"
    | "bureau_études"
    | "maître_d_œuvre"
    | "artisan"
    | "fournisseur"
    | "autre";
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status: string;
  since_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerInsert {
  id?: string;
  name: string;
  type:
    | "architecte"
    | "bureau_études"
    | "maître_d_œuvre"
    | "artisan"
    | "fournisseur"
    | "autre";
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status?: string;
  since_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerUpdate {
  name?: string;
  type?:
    | "architecte"
    | "bureau_études"
    | "maître_d_œuvre"
    | "artisan"
    | "fournisseur"
    | "autre";
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status?: string;
  since_date?: string | null;
  notes?: string | null;
  updated_at?: string;
}

// ==================== PARTNERS PROFILE ====================
export interface PartnerProfileRow {
  id: string;
  user_id: string;
  partner_id: string;
  siret?: string | null;
  company_name?: string | null;
  website?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerProfileInsert {
  id?: string;
  user_id: string;
  partner_id: string;
  siret?: string | null;
  company_name?: string | null;
  website?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerProfileUpdate {
  user_id?: string;
  partner_id?: string;
  siret?: string | null;
  company_name?: string | null;
  website?: string | null;
  bio?: string | null;
  updated_at?: string;
}

// ==================== DOCUMENTS ====================
export interface DocumentRow {
  id: string;
  client_id?: string | null;
  project_id?: string | null;
  partner_id?: string | null;
  name: string;
  file_type?: string | null;
  folder?: string | null;
  file_url?: string | null;
  file_size?: number | null;
  status: "en_attente" | "validé" | "rejeté";
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentInsert {
  id?: string;
  client_id?: string | null;
  project_id?: string | null;
  partner_id?: string | null;
  name: string;
  file_type?: string | null;
  folder?: string | null;
  file_url?: string | null;
  file_size?: number | null;
  status?: "en_attente" | "validé" | "rejeté";
  uploaded_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentUpdate {
  client_id?: string | null;
  project_id?: string | null;
  partner_id?: string | null;
  name?: string;
  file_type?: string | null;
  folder?: string | null;
  file_url?: string | null;
  file_size?: number | null;
  status?: "en_attente" | "validé" | "rejeté";
  updated_at?: string;
}

// ==================== PAYMENTS ====================
export interface PaymentRow {
  id: string;
  client_id: string;
  project_id?: string | null;
  date: string;
  amount: number;
  description?: string | null;
  status: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string | null;
  reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentInsert {
  id?: string;
  client_id: string;
  project_id?: string | null;
  date: string;
  amount: number;
  description?: string | null;
  status?: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string | null;
  reference?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentUpdate {
  client_id?: string;
  project_id?: string | null;
  date?: string;
  amount?: number;
  description?: string | null;
  status?: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string | null;
  reference?: string | null;
  updated_at?: string;
}

// ==================== EXPENSES ====================
export interface ExpenseRow {
  id: string;
  project_id: string;
  date: string;
  amount: number;
  description: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres"
    | null;
  supplier?: string | null;
  invoice_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseInsert {
  id?: string;
  project_id: string;
  date: string;
  amount: number;
  description: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres"
    | null;
  supplier?: string | null;
  invoice_number?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseUpdate {
  project_id?: string;
  date?: string;
  amount?: number;
  description?: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres"
    | null;
  supplier?: string | null;
  invoice_number?: string | null;
  updated_at?: string;
}

// ==================== PROJECT GALLERY ====================
export interface ProjectGalleryRow {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  media_type: "photo" | "video";
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectGalleryInsert {
  id?: string;
  project_id: string;
  title: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectGalleryUpdate {
  project_id?: string;
  title?: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
  updated_at?: string;
}

// ==================== PARTNER CERTIFICATIONS ====================
export interface PartnerCertificationRow {
  id: string;
  partner_id: string;
  name: string;
  number?: string | null;
  issuing_organization?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  certificate_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerCertificationInsert {
  id?: string;
  partner_id: string;
  name: string;
  number?: string | null;
  issuing_organization?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  certificate_url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerCertificationUpdate {
  partner_id?: string;
  name?: string;
  number?: string | null;
  issuing_organization?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  certificate_url?: string | null;
  status?: string;
  updated_at?: string;
}

// ==================== PARTNER PERSONAL PROJECTS ====================
export interface PartnerPersonalProjectRow {
  id: string;
  partner_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  image_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerPersonalProjectInsert {
  id?: string;
  partner_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerPersonalProjectUpdate {
  partner_id?: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  image_url?: string | null;
  status?: string;
  updated_at?: string;
}

// ==================== PARTNER GALLERY ====================
export interface PartnerGalleryRow {
  id: string;
  partner_id: string;
  personal_project_id?: string | null;
  title?: string | null;
  description?: string | null;
  image_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerGalleryInsert {
  id?: string;
  partner_id: string;
  personal_project_id?: string | null;
  title?: string | null;
  description?: string | null;
  image_url: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerGalleryUpdate {
  partner_id?: string;
  personal_project_id?: string | null;
  title?: string | null;
  description?: string | null;
  image_url?: string;
  order_index?: number;
  updated_at?: string;
}

/**
 * Helper type for Supabase query responses
 */
export type SupabaseTable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];

export type SupabaseRow<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Row"];

export type SupabaseInsert<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Insert"];

export type SupabaseUpdate<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Update"];
