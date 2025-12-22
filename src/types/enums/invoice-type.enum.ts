/**
 * Invoice Type Enum
 *
 * Types of invoices: devis (quote/estimate) or facture (invoice)
 */
export enum InvoiceType {
  DEVIS = "devis",
  FACTURE = "facture",
}

export type InvoiceTypeType = "devis" | "facture";

export const INVOICE_TYPE_LABELS: Record<InvoiceTypeType, string> = {
  devis: "Devis",
  facture: "Facture",
};
