/**
 * Partner type matching the public.partners table schema
 */
export interface Partner {
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

/**
 * Partner with related data
 */
export interface PartnerWithDetails extends Partner {
  user?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
  } | null;
  projects_count?: number;
  projects?: Array<{
    id: string;
    name: string;
    status: string;
    client_name?: string;
    role?: string | null;
    is_primary?: boolean;
  }>;
  documents_count?: number;
  certifications?: Array<{
    id: string;
    name: string;
    number?: string | null;
    issuing_organization?: string | null;
    issue_date?: string | null;
    expiry_date?: string | null;
    certificate_url?: string | null;
    status: string;
  }>;
  personal_projects?: Array<{
    id: string;
    name: string;
    description?: string | null;
    category?: string | null;
    location?: string | null;
    year?: number | null;
    image_url?: string | null;
    status: string;
  }>;
  gallery?: Array<{
    id: string;
    title?: string | null;
    description?: string | null;
    image_url: string;
    order_index: number;
    personal_project_id?: string | null;
  }>;
}
