import { createClient } from "@/lib/supabase/server";

/**
 * Create Supabase client for Next.js App Router API routes
 * This uses the server client which handles cookies via next/headers
 */
export async function createAppRouteClient() {
  return await createClient();
}
