import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierWithDetails,
  ChantierDetailResponse,
  UpdateChantierRequest,
} from "@/types/chantier.types";
import type { ChantierUpdate } from "@/types/supabase-database.types";

/**
 * Check if the current user is an admin
 */
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
 * GET /api/admin/chantiers/[id]
 * Get a single chantier with all related data
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
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    // Get chantier
    const { data: chantier, error: chantierError } = await typedTable(
      "chantiers"
    )
      .select("*")
      .eq("id", id)
      .single();

    if (chantierError || !chantier) {
      return NextResponse.json(
        { error: "Chantier not found" },
        { status: 404 }
      );
    }

    // Get project info
    const { data: project } = await typedTable("projects")
      .select("id, name, client_id")
      .eq("id", chantier.project_id)
      .single();

    // Get client info if project exists
    let client = null;
    if (project) {
      const { data: clientData } = await typedTable("users")
        .select("id, full_name, email")
        .eq("id", project.client_id)
        .single();
      client = clientData;
    }

    // Get team members
    const { data: team } = await typedTable("chantier_team")
      .select("*")
      .eq("chantier_id", id)
      .order("created_at", { ascending: true });

    // Get planning tasks
    const { data: planning } = await typedTable("chantier_planning")
      .select("*")
      .eq("chantier_id", id)
      .order("order_index", { ascending: true });

    // Get gallery
    const { data: gallery } = await typedTable("chantier_gallery")
      .select("*")
      .eq("chantier_id", id)
      .order("date", { ascending: false });

    // Get notes
    const { data: notes } = await typedTable("chantier_notes")
      .select("*")
      .eq("chantier_id", id)
      .order("date", { ascending: false });

    const chantierWithDetails: ChantierWithDetails = {
      ...chantier,
      project: project
        ? {
            id: project.id,
            name: project.name,
            client_id: project.client_id,
            client: client
              ? {
                  id: client.id,
                  full_name: client.full_name,
                  email: client.email || undefined,
                }
              : null,
          }
        : null,
      team: team || [],
      planning: planning || [],
      gallery: gallery || [],
      notes: notes || [],
    };

    const response: ChantierDetailResponse = {
      chantier: chantierWithDetails,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/chantiers/[id]
 * Update a chantier
 */
export async function PUT(
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
    const data: UpdateChantierRequest = await request.json();

    // Verify chantier exists
    const { data: existingChantier } = await typedTable("chantiers")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingChantier) {
      return NextResponse.json(
        { error: "Chantier not found" },
        { status: 404 }
      );
    }

    // If project_id is being updated, verify project exists
    if (data.project_id) {
      const projectCheck = await typedTable("projects")
        .select("id")
        .eq("id", data.project_id)
        .single();

      if (!projectCheck.data) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
    }

    // Update chantier
    const updateData: ChantierUpdate = {};
    if (data.project_id !== undefined) updateData.project_id = data.project_id;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.start_date !== undefined) updateData.start_date = data.start_date;
    if (data.end_date !== undefined) updateData.end_date = data.end_date;

    const { data: updatedChantier, error } = await typedTable("chantiers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating chantier:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chantier: updatedChantier });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/chantiers/[id]
 * Delete a chantier
 */
export async function DELETE(
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

    // Verify chantier exists
    const { data: existingChantier } = await typedTable("chantiers")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingChantier) {
      return NextResponse.json(
        { error: "Chantier not found" },
        { status: 404 }
      );
    }

    // Delete chantier (cascade will delete related records)
    const { error } = await typedTable("chantiers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting chantier:", error);
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
