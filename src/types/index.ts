/**
 * Central type exports
 *
 * This file serves as a barrel export for all domain types.
 * Only actively used types are exported here.
 */

// Core foundational types
export * from "./database.types";
export * from "./supabase-database.types";

// Authentication & User types
export * from "./auth.types";
export * from "./user.types";
export * from "./user-management.types";

// Domain entity types
export * from "./client.types";
export * from "./partner.types";
export * from "./project.types";
export * from "./chantier.types";
export * from "./document.types";
export * from "./payment.types";
export * from "./expense.types";
export * from "./gallery.types";

// Enums
export * from "./enums";
