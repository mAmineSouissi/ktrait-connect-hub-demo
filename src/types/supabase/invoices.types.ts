/**
 * Invoices table types
 */
import type { InvoiceTypeType } from "../enums/invoice-type.enum";
import type { InvoiceStatusType } from "../enums/invoice-status.enum";

export interface InvoiceRow {
  id: string;
  invoice_number: string;
  type: InvoiceTypeType;
  client_id: string;
  project_id?: string | null;
  template_id?: string | null;
  issue_date: string;
  due_date?: string | null;
  status: InvoiceStatusType;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes?: string | null;
  terms?: string | null;
  reference?: string | null;
  generated_pdf_url?: string | null;
  sent_at?: string | null;
  validated_at?: string | null;
  paid_at?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceInsert {
  id?: string;
  invoice_number?: string; // Auto-generated if not provided
  type: InvoiceTypeType;
  client_id: string;
  project_id?: string | null;
  template_id?: string | null;
  issue_date?: string;
  due_date?: string | null;
  status?: InvoiceStatusType;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  notes?: string | null;
  terms?: string | null;
  reference?: string | null;
  generated_pdf_url?: string | null;
  sent_at?: string | null;
  validated_at?: string | null;
  paid_at?: string | null;
  created_by?: string | null;
}

export interface InvoiceUpdate {
  invoice_number?: string;
  type?: InvoiceTypeType;
  client_id?: string;
  project_id?: string | null;
  template_id?: string | null;
  issue_date?: string;
  due_date?: string | null;
  status?: InvoiceStatusType;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  notes?: string | null;
  terms?: string | null;
  reference?: string | null;
  generated_pdf_url?: string | null;
  sent_at?: string | null;
  validated_at?: string | null;
  paid_at?: string | null;
}

/**
 * Invoice Items table types
 */
export interface InvoiceItemRow {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit?: string | null;
  tax_rate?: number | null;
  line_total: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItemInsert {
  id?: string;
  invoice_id: string;
  description: string;
  quantity?: number;
  unit_price: number;
  unit?: string | null;
  tax_rate?: number | null;
  line_total?: number; // Auto-calculated if not provided
  order_index?: number;
}

export interface InvoiceItemUpdate {
  description?: string;
  quantity?: number;
  unit_price?: number;
  unit?: string | null;
  tax_rate?: number | null;
  line_total?: number;
  order_index?: number;
}
