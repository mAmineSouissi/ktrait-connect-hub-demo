/**
 * Typed Supabase Client Helpers
 *
 * These helpers provide type-safe access to Supabase tables
 * by wrapping the admin client with proper types.
 */

import { getSupabaseAdmin } from "./admin";
import type {
  Database,
  SupabaseRow,
  SupabaseInsert,
  SupabaseUpdate,
} from "@/types/supabase-database.types";

/**
 * Get a typed Supabase table query builder
 * This provides type safety while maintaining compatibility with Supabase's query builder
 */
export function typedTable<T extends keyof Database["public"]["Tables"]>(
  tableName: T
) {
  const client = getSupabaseAdmin();
  // We use `as any` here because Supabase's types are complex and don't match our schema types
  // But we ensure type safety by using our typed Insert/Update types when calling insert/update
  return client.from(tableName) as any;
}

/**
 * Type-safe helper to ensure insert data matches our schema
 */
export function typedInsert<T extends keyof Database["public"]["Tables"]>(
  tableName: T,
  data: SupabaseInsert<T> | SupabaseInsert<T>[]
) {
  return typedTable(tableName).insert(data);
}

/**
 * Type-safe helper to ensure update data matches our schema
 */
export function typedUpdate<T extends keyof Database["public"]["Tables"]>(
  tableName: T,
  data: SupabaseUpdate<T>
) {
  return typedTable(tableName).update(data);
}

/**
 * Type helper for query results
 */
export type TypedQueryResult<T extends keyof Database["public"]["Tables"]> = {
  data: SupabaseRow<T>[] | null;
  error: any;
  count?: number | null;
};

/**
 * Type helper for single query results
 */
export type TypedSingleResult<T extends keyof Database["public"]["Tables"]> = {
  data: SupabaseRow<T> | null;
  error: any;
};
