import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { PartnerRow } from "@/types/supabase-database.types";

/**
 * Check if the current user is a client
 */
async function isClient(): Promise<boolean> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    return userData?.role === "client";
  } catch (error) {
    console.error("Error checking client:", error);
    return false;
  }
}

/**
 * GET /api/client/partners
 * List all partners (read-only for clients to select when adding to projects)
 */
export async function GET(request: NextRequest) {
  const client = await isClient();
  
  if (!client) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    let query = typedTable("partners").select("*", { count: "exact" })
      .order("name", { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: partners,
      error,
      count,
    } = result as {
      data: PartnerRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching partners:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      partners: partners || [],
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

