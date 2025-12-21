import { UserRole } from "./database.types";

export interface User {
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

export interface Client {
  id: string;
  user_id: string;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithClient extends User {
  client?: Client;
}
