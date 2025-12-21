export type UserRole = "client" | "partner" | "admin";

export type NotificationStatus = "unread" | "read" | "archived";

export type ProjectStatus =
  | "planifié"
  | "en_cours"
  | "en_attente"
  | "terminé"
  | "annulé";

export type StageStatus = "à_venir" | "en_cours" | "terminé" | "bloqué";

export type ChantierStatus =
  | "planifié"
  | "en_cours"
  | "en_attente"
  | "terminé"
  | "suspendu";

export interface DatabaseConfig {
  created_at: string;
  updated_at: string;
}
