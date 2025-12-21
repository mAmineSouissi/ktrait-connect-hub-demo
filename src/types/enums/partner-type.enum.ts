/**
 * Partner type enum
 */
export enum PartnerType {
  ARCHITECTE = "architecte",
  BUREAU_ETUDES = "bureau_études",
  MAITRE_D_OEUVRE = "maître_d_œuvre",
  ARTISAN = "artisan",
  FOURNISSEUR = "fournisseur",
  AUTRE = "autre",
}

export type PartnerTypeType =
  | PartnerType.ARCHITECTE
  | PartnerType.BUREAU_ETUDES
  | PartnerType.MAITRE_D_OEUVRE
  | PartnerType.ARTISAN
  | PartnerType.FOURNISSEUR
  | PartnerType.AUTRE;
