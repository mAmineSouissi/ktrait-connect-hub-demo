export interface QuoteRequest {
  id: string;
  client_id: string;
  project_type?: string;
  budget_range?: string;
  description: string;
  status: "pending" | "assigned" | "quoted" | "accepted" | "rejected";
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}
