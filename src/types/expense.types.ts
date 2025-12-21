/**
 * Expense type matching the public.expenses table schema
 */
export interface Expense {
  id: string;
  project_id: string;
  date: string;
  amount: number;
  description: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres"
    | null;
  supplier?: string | null;
  invoice_number?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Expense with related data
 */
export interface ExpenseWithDetails extends Expense {
  project_name?: string;
}
