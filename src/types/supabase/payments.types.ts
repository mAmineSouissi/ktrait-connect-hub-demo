/**
 * Payments table types
 */
import type { PaymentStatusType } from "../enums/payment-status.enum";

export interface PaymentRow {
  id: string;
  client_id: string;
  project_id?: string | null;
  date: string;
  amount: number;
  description?: string | null;
  status: PaymentStatusType;
  payment_method?: string | null;
  reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentInsert {
  id?: string;
  client_id: string;
  project_id?: string | null;
  date: string;
  amount: number;
  description?: string | null;
  status?: PaymentStatusType;
  payment_method?: string | null;
  reference?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentUpdate {
  client_id?: string;
  project_id?: string | null;
  date?: string;
  amount?: number;
  description?: string | null;
  status?: PaymentStatusType;
  payment_method?: string | null;
  reference?: string | null;
  updated_at?: string;
}
