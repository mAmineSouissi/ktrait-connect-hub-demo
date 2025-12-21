/**
 * User and Client types
 *
 * These are re-exports/aliases of database schema types for convenience.
 * The actual database types are in types/supabase/
 */

// Re-export UserRow as User for backward compatibility
export type { UserRow as User } from "./supabase/users.types";

// Re-export ClientRow as Client for backward compatibility
export type { ClientRow as Client } from "./supabase/clients.types";

import type { UserRow } from "./supabase/users.types";
import type { ClientRow } from "./supabase/clients.types";

export interface UserWithClient extends UserRow {
  client?: ClientRow;
}
