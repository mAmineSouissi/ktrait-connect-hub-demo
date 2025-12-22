/**
 * Invoice Templates table types
 */
import type { InvoiceTypeType } from "../enums/invoice-type.enum";
import type { TemplateFileTypeType } from "../enums/template-file-type.enum";

export interface InvoiceTemplateRow {
  id: string;
  name: string;
  type: InvoiceTypeType;
  description?: string | null;
  template_file_url: string;
  template_file_type: TemplateFileTypeType;
  is_default: boolean;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplateInsert {
  id?: string;
  name: string;
  type: InvoiceTypeType;
  description?: string | null;
  template_file_url: string;
  template_file_type: TemplateFileTypeType;
  is_default?: boolean;
  is_active?: boolean;
  created_by?: string | null;
}

export interface InvoiceTemplateUpdate {
  name?: string;
  type?: InvoiceTypeType;
  description?: string | null;
  template_file_url?: string;
  template_file_type?: TemplateFileTypeType;
  is_default?: boolean;
  is_active?: boolean;
}
