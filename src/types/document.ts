export interface Media {
  id: string;
  filename: string;
  filepath: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  media_id: string;
  title: string;
  document_type: "plan" | "contract" | "invoice" | "report" | "other";
  visibility: "public" | "members" | "private";
  current_version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  media_id: string;
  version_number: number;
  uploaded_by: string;
  change_notes?: string;
  created_at: string;
}
