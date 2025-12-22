/**
 * Invoice Template application types
 */
import type { InvoiceTemplateRow } from "./supabase/invoice-templates.types";
import type { InvoiceTypeType } from "./enums/invoice-type.enum";
import type { TemplateFileTypeType } from "./enums/template-file-type.enum";

/**
 * Invoice Template - alias for InvoiceTemplateRow
 */
export type InvoiceTemplate = InvoiceTemplateRow;

/**
 * Create Template Request
 */
export interface CreateTemplateRequest {
  name: string;
  type: InvoiceTypeType;
  description?: string | null;
  template_file: File; // File to upload
  template_file_type: TemplateFileTypeType;
  is_default?: boolean;
  is_active?: boolean;
}

/**
 * Update Template Request
 */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string | null;
  template_file?: File; // Optional file update
  is_default?: boolean;
  is_active?: boolean;
}

/**
 * Template List Response
 */
export interface TemplateListResponse {
  templates: InvoiceTemplate[];
  total: number;
}

/**
 * Template Detail Response
 */
export interface TemplateDetailResponse {
  template: InvoiceTemplate;
}

/**
 * Create Template Response
 */
export interface CreateTemplateResponse {
  template: InvoiceTemplate;
  message: string;
}

/**
 * Update Template Response
 */
export interface UpdateTemplateResponse {
  template: InvoiceTemplate;
  message: string;
}

/**
 * Delete Template Response
 */
export interface DeleteTemplateResponse {
  message: string;
  deleted: boolean;
}
