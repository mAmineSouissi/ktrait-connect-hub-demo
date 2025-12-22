/**
 * Invoice application types
 *
 * These extend database schema types with application-specific fields.
 */
import type { InvoiceRow, InvoiceItemRow } from "./supabase/invoices.types";
import type { InvoiceTemplateRow } from "./supabase/invoice-templates.types";
import type { InvoiceTypeType } from "./enums/invoice-type.enum";
import type { InvoiceStatusType } from "./enums/invoice-status.enum";

/**
 * Invoice type - extends InvoiceRow with related data
 */
export interface Invoice extends InvoiceRow {
  // Related data (populated by API)
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
  template?: InvoiceTemplateRow | null;
  items?: InvoiceItem[];
}

/**
 * Invoice Item - alias for InvoiceItemRow
 */
export type InvoiceItem = InvoiceItemRow;

/**
 * Invoice with all details (items, client, project, template)
 */
export interface InvoiceWithDetails extends Invoice {
  items: InvoiceItem[];
  client: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    postal_code?: string | null;
    company_name?: string | null;
    tax_id?: string | null;
  };
  project?: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
  template: InvoiceTemplateRow | null;
}

/**
 * Create Invoice Request
 */
export interface CreateInvoiceRequest {
  type: InvoiceTypeType;
  client_id: string;
  project_id?: string | null;
  template_id?: string | null;
  issue_date?: string;
  due_date?: string | null;
  tax_rate?: number;
  notes?: string | null;
  terms?: string | null;
  reference?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    unit?: string | null;
    tax_rate?: number | null;
  }>;
}

/**
 * Update Invoice Request
 */
export interface UpdateInvoiceRequest {
  client_id?: string;
  project_id?: string | null;
  template_id?: string | null;
  issue_date?: string;
  due_date?: string | null;
  status?: InvoiceStatusType;
  tax_rate?: number;
  notes?: string | null;
  terms?: string | null;
  reference?: string | null;
  items?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    unit?: string | null;
    tax_rate?: number | null;
  }>;
}

/**
 * Invoice List Response
 */
export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
}

/**
 * Invoice Detail Response
 */
export interface InvoiceDetailResponse {
  invoice: InvoiceWithDetails;
}

/**
 * Create Invoice Response
 */
export interface CreateInvoiceResponse {
  invoice: InvoiceWithDetails;
  message: string;
}

/**
 * Update Invoice Response
 */
export interface UpdateInvoiceResponse {
  invoice: InvoiceWithDetails;
  message: string;
}

/**
 * Delete Invoice Response
 */
export interface DeleteInvoiceResponse {
  message: string;
  deleted: boolean;
}
