/**
 * Payment status enum
 */
export enum PaymentStatus {
  EN_ATTENTE = "en_attente",
  PAYE = "payé",
  PARTIEL = "partiel",
  ANNULE = "annulé",
}

export type PaymentStatusType =
  | PaymentStatus.EN_ATTENTE
  | PaymentStatus.PAYE
  | PaymentStatus.PARTIEL
  | PaymentStatus.ANNULE;
