import { UserRole } from "./database.types";
import type { UserRow } from "./supabase/users.types";

export interface UserListItem extends UserRow {
  projects_count?: number;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  // Note: approval_status, approved_at, approved_by, rejection_reason are already in UserRow
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active?: boolean;
  city?: string;
  address?: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  approval_status?: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  city?: string;
  address?: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
}

export interface UserDetail extends UserRow {
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
  projects_count?: number;
  // Note: approval_status, approved_at, approved_by, rejection_reason are already in UserRow
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

export type UserStatus = "Actif" | "En attente" | "Inactif";

export function getUserStatus(user: UserRow | UserListItem): UserStatus {
  if (!user.is_active) return "Inactif";
  if (!user.email_verified) return "En attente";
  return "Actif";
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
}

export interface UserDetailResponse {
  user: UserDetail;
}

export interface CreateUserResponse {
  user: UserDetail;
  message?: string;
}

export interface UpdateUserResponse {
  user: UserDetail;
  message?: string;
}

export interface DeleteUserResponse {
  message: string;
  deleted: boolean;
}
