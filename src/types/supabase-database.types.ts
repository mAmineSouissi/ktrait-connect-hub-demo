/**
 * Supabase Database Types
 *
 * This file serves as a barrel export for all database table types.
 * Types are organized in separate files within the supabase-database folder.
 *
 * @see ./supabase-database/ for individual type files
 */

// Re-export all types from organized files
export * from "./supabase";

// Re-export Database interface and helper types
export type {
  Database,
  SupabaseTable,
  SupabaseRow,
  SupabaseInsert,
  SupabaseUpdate,
} from "./supabase/database.interface";
