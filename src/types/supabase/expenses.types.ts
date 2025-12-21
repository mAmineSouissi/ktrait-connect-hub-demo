/**
 * Expenses table types
 */
import type { ExpenseCategoryType } from "../enums/expense-category.enum";

export interface ExpenseRow {
  id: string;
  project_id: string;
  date: string;
  amount: number;
  description: string;
  category?: ExpenseCategoryType | null;
  supplier?: string | null;
  invoice_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseInsert {
  id?: string;
  project_id: string;
  date: string;
  amount: number;
  description: string;
  category?: ExpenseCategoryType | null;
  supplier?: string | null;
  invoice_number?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseUpdate {
  project_id?: string;
  date?: string;
  amount?: number;
  description?: string;
  category?: ExpenseCategoryType | null;
  supplier?: string | null;
  invoice_number?: string | null;
  updated_at?: string;
}
