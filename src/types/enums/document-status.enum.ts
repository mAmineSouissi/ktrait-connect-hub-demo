/**
 * Document status enum
 */
export enum DocumentStatus {
  EN_ATTENTE = "en_attente",
  VALIDE = "validé",
  REJETE = "rejeté",
}

export type DocumentStatusType =
  | DocumentStatus.EN_ATTENTE
  | DocumentStatus.VALIDE
  | DocumentStatus.REJETE;
