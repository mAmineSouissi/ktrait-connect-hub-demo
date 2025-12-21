/**
 * Users table types
 */
import type { UserRole } from "../database.types";
import type { ApprovalStatusType } from "../enums/approval-status.enum";

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  email_verified: boolean;
  role: UserRole;
  approval_status?: ApprovalStatusType | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
  role?: UserRole;
  approval_status?: ApprovalStatusType | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  updated_at?: string;
}
