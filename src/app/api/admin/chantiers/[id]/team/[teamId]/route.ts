import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ChantierTeamUpdate } from "@/types/supabase-database.types";

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
 * PUT /api/admin/chantiers/[id]/team/[teamId]
 * Update a team member
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; teamId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { teamId } = params;
    const data = await request.json();

    const updateData: ChantierTeamUpdate = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;

    const { data: teamMember, error } = await typedTable("chantier_team")
      .update(updateData)
      .eq("id", teamId)
      .select()
      .single();

    if (error) {
      console.error("Error updating team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ teamMember });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/chantiers/[id]/team/[teamId]
 * Delete a team member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; teamId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { teamId } = params;

    const { error } = await typedTable("chantier_team")
      .delete()
      .eq("id", teamId);

    if (error) {
      console.error("Error deleting team member:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
