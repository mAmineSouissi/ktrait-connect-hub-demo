/**
 * Clients table types
 */
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
