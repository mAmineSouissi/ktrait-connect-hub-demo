export enum Role {
  ADMIN = "admin",
  CLIENT = "client",
  PARTNER = "partner",
}

export type RoleType = Role.ADMIN | Role.CLIENT | Role.PARTNER;
