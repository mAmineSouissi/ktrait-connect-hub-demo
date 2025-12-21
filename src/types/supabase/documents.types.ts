/**
 * Documents table types
 */
import type { DocumentStatusType } from "../enums/document-status.enum";

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
  status: DocumentStatusType;
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
  status?: DocumentStatusType;
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
  status?: DocumentStatusType;
  updated_at?: string;
}
