export interface GdprErasureRequest {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "completed" | "rejected";
  requested_at: string;
  completed_at?: string;
  notes?: string;
}

export interface DataExport {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "ready" | "expired";
  file_path?: string;
  expires_at?: string;
  requested_at: string;
  completed_at?: string;
}
