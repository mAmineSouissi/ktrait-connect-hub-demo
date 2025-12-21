import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierTeamInsert,
  ChantierTeamUpdate,
} from "@/types/supabase-database.types";

async function isAdmin(): Promise<boolean> {
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

    return userData?.role === "admin";
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/admin/chantiers/[id]/team
 * Get all team members for a chantier
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    const { data: team, error } = await typedTable("chantier_team")
      .select("*")
      .eq("chantier_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching team:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ team: team || [] });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/chantiers/[id]/team
 * Create a new team member
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    const data = await request.json();

    if (!data.name || !data.role) {
      return NextResponse.json(
        { error: "name and role are required" },
        { status: 400 }
      );
    }

    const insertData: ChantierTeamInsert = {
      chantier_id: id,
      name: data.name,
      role: data.role,
      phone: data.phone || null,
      email: data.email || null,
    };

    const { data: teamMember, error } = await typedTable("chantier_team")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ teamMember }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
