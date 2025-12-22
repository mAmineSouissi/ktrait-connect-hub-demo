/**
 * Main Database interface
 *
 * This interface defines the structure of the Supabase database
 * and references all table types.
 */
import type { UserRow, UserInsert, UserUpdate } from "./users.types";
import type { ClientRow, ClientInsert, ClientUpdate } from "./clients.types";
import type {
  ProjectRow,
  ProjectInsert,
  ProjectUpdate,
  ProjectPhaseRow,
  ProjectPhaseInsert,
  ProjectPhaseUpdate,
  ProjectPartnerRow,
  ProjectPartnerInsert,
  ProjectPartnerUpdate,
} from "./projects.types";
import type {
  PartnerRow,
  PartnerInsert,
  PartnerUpdate,
  PartnerProfileRow,
  PartnerProfileInsert,
  PartnerProfileUpdate,
  PartnerCertificationRow,
  PartnerCertificationInsert,
  PartnerCertificationUpdate,
  PartnerPersonalProjectRow,
  PartnerPersonalProjectInsert,
  PartnerPersonalProjectUpdate,
  PartnerGalleryRow,
  PartnerGalleryInsert,
  PartnerGalleryUpdate,
} from "./partners.types";
import type {
  DocumentRow,
  DocumentInsert,
  DocumentUpdate,
} from "./documents.types";
import type {
  PaymentRow,
  PaymentInsert,
  PaymentUpdate,
} from "./payments.types";
import type {
  ExpenseRow,
  ExpenseInsert,
  ExpenseUpdate,
} from "./expenses.types";
import type {
  ProjectGalleryRow,
  ProjectGalleryInsert,
  ProjectGalleryUpdate,
} from "./gallery.types";
import type {
  ChantierRow,
  ChantierInsert,
  ChantierUpdate,
  ChantierTeamRow,
  ChantierTeamInsert,
  ChantierTeamUpdate,
  ChantierPlanningRow,
  ChantierPlanningInsert,
  ChantierPlanningUpdate,
  ChantierGalleryRow,
  ChantierGalleryInsert,
  ChantierGalleryUpdate,
  ChantierNoteRow,
  ChantierNoteInsert,
  ChantierNoteUpdate,
} from "./chantiers.types";
import type {
  InvoiceRow,
  InvoiceInsert,
  InvoiceUpdate,
  InvoiceItemRow,
  InvoiceItemInsert,
  InvoiceItemUpdate,
} from "./invoices.types";
import type {
  InvoiceTemplateRow,
  InvoiceTemplateInsert,
  InvoiceTemplateUpdate,
} from "./invoice-templates.types";

/**
 * Database table row types
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      clients: {
        Row: ClientRow;
        Insert: ClientInsert;
        Update: ClientUpdate;
      };
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      project_phases: {
        Row: ProjectPhaseRow;
        Insert: ProjectPhaseInsert;
        Update: ProjectPhaseUpdate;
      };
      project_partners: {
        Row: ProjectPartnerRow;
        Insert: ProjectPartnerInsert;
        Update: ProjectPartnerUpdate;
      };
      partners: {
        Row: PartnerRow;
        Insert: PartnerInsert;
        Update: PartnerUpdate;
      };
      partners_profile: {
        Row: PartnerProfileRow;
        Insert: PartnerProfileInsert;
        Update: PartnerProfileUpdate;
      };
      documents: {
        Row: DocumentRow;
        Insert: DocumentInsert;
        Update: DocumentUpdate;
      };
      payments: {
        Row: PaymentRow;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      expenses: {
        Row: ExpenseRow;
        Insert: ExpenseInsert;
        Update: ExpenseUpdate;
      };
      project_gallery: {
        Row: ProjectGalleryRow;
        Insert: ProjectGalleryInsert;
        Update: ProjectGalleryUpdate;
      };
      partner_certifications: {
        Row: PartnerCertificationRow;
        Insert: PartnerCertificationInsert;
        Update: PartnerCertificationUpdate;
      };
      partner_personal_projects: {
        Row: PartnerPersonalProjectRow;
        Insert: PartnerPersonalProjectInsert;
        Update: PartnerPersonalProjectUpdate;
      };
      partner_gallery: {
        Row: PartnerGalleryRow;
        Insert: PartnerGalleryInsert;
        Update: PartnerGalleryUpdate;
      };
      chantiers: {
        Row: ChantierRow;
        Insert: ChantierInsert;
        Update: ChantierUpdate;
      };
      chantier_team: {
        Row: ChantierTeamRow;
        Insert: ChantierTeamInsert;
        Update: ChantierTeamUpdate;
      };
      chantier_planning: {
        Row: ChantierPlanningRow;
        Insert: ChantierPlanningInsert;
        Update: ChantierPlanningUpdate;
      };
      chantier_gallery: {
        Row: ChantierGalleryRow;
        Insert: ChantierGalleryInsert;
        Update: ChantierGalleryUpdate;
      };
      chantier_notes: {
        Row: ChantierNoteRow;
        Insert: ChantierNoteInsert;
        Update: ChantierNoteUpdate;
      };
      invoices: {
        Row: InvoiceRow;
        Insert: InvoiceInsert;
        Update: InvoiceUpdate;
      };
      invoice_items: {
        Row: InvoiceItemRow;
        Insert: InvoiceItemInsert;
        Update: InvoiceItemUpdate;
      };
      invoice_templates: {
        Row: InvoiceTemplateRow;
        Insert: InvoiceTemplateInsert;
        Update: InvoiceTemplateUpdate;
      };
    };
  };
}

/**
 * Helper type for Supabase query responses
 */
export type SupabaseTable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];

export type SupabaseRow<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Row"];

export type SupabaseInsert<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Insert"];

export type SupabaseUpdate<T extends keyof Database["public"]["Tables"]> =
  SupabaseTable<T>["Update"];
