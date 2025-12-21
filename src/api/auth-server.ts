// api/auth-server.ts - SERVER SIDE ONLY
// This file should only be imported in server components or API routes
import { createClient as createServerClient } from "@/lib/supabase/server";
import { User } from "@/types";

/**
 * Get current user (SERVER SIDE)
 * Uses server client with proper cookie handling for Next.js
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const supabase = await createServerClient();

    // Get auth user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user profile:", userError);
      return null;
    }

    return userData as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
