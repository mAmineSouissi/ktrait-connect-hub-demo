/**
 * Payment type matching the public.payments table schema
 */
export interface Payment {
  id: string;
  client_id: string;
  project_id?: string | null;
  date: string;
  amount: number;
  description?: string | null;
  status: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string | null;
  reference?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Payment with related data
 */
export interface PaymentWithDetails extends Payment {
  project_name?: string;
  client_name?: string;
}
