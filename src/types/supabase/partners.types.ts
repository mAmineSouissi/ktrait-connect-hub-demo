/**
 * Partners, Partner Profiles, Certifications, Personal Projects, and Gallery table types
 */
import type { PartnerTypeType } from "../enums/partner-type.enum";

// ==================== PARTNERS ====================
export interface PartnerRow {
  id: string;
  name: string;
  type: PartnerTypeType;
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
  type: PartnerTypeType;
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
  type?: PartnerTypeType;
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
