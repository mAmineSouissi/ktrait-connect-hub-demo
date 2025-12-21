/**
 * Document type matching the public.documents table schema
 */
export interface Document {
  id: string;
  client_id?: string | null;
  project_id?: string | null;
  partner_id?: string | null;
  name: string;
  file_type?: string | null;
  folder?: string | null;
  file_url?: string | null;
  file_size?: string | null;
  status: "en_attente" | "validé" | "rejeté";
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Document with related data
 */
export interface DocumentWithDetails extends Document {
  project_name?: string;
  client_name?: string;
  partner_name?: string;
}
