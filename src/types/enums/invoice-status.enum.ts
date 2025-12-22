/**
 * Invoice Status Enum
 *
 * Status values for invoices (both devis and factures)
 */
export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  VALIDATED = "validated",
  REJECTED = "rejected",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export type InvoiceStatusType =
  | "draft"
  | "sent"
  | "validated"
  | "rejected"
  | "paid"
  | "overdue"
  | "cancelled";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatusType, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  validated: "Validé",
  rejected: "Rejeté",
  paid: "Payé",
  overdue: "En retard",
  cancelled: "Annulé",
};
