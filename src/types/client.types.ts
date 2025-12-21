import type { UserRow } from "./supabase/users.types";

export interface ClientDetail extends UserRow {
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  projects_count?: number;
  // Related data (populated by API)
  projects?: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    budget: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
  }>;
  payments?: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    description: string;
  }>;
}

export interface CreateClientRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  is_active?: boolean;
  city?: string;
  address?: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
}

export interface UpdateClientRequest {
  full_name?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  email_verified?: boolean;
  city?: string;
  address?: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
}

export interface ClientListItem extends UserRow {
  projects_count?: number;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
}

export interface ClientListResponse {
  clients: ClientListItem[];
  total: number;
}

export interface ClientDetailResponse {
  client: ClientDetail;
}

export interface CreateClientResponse {
  client: ClientDetail;
  message?: string;
}

export interface UpdateClientResponse {
  client: ClientDetail;
  message?: string;
}

export interface DeleteClientResponse {
  message: string;
  deleted: boolean;
}
