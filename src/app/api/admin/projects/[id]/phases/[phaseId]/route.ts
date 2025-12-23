import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectPhaseRow,
  ProjectPhaseUpdate,
} from "@/types/supabase-database.types";

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
    console.error("Error checking admin:", error);
    return false;
  }
}

/**
 * GET /api/admin/projects/[id]/phases/[phaseId]
 * Get phase by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; phaseId: string } }
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
    const { phaseId } = params;

    if (!phaseId) {
      return NextResponse.json(
        { error: "Phase ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("project_phases")
      .select("*")
      .eq("id", phaseId)
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching phase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!phase) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 });
    }

    return NextResponse.json({ phase });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]/phases/[phaseId]
 * Update phase
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; phaseId: string } }
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
    const { phaseId } = params;

    if (!phaseId) {
      return NextResponse.json(
        { error: "Phase ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      status,
      progress_percentage,
      order_index,
      started_at,
      completed_at,
    } = body;

    // Build update object with proper typing
    const updateData: ProjectPhaseUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (progress_percentage !== undefined)
      updateData.progress_percentage = Math.max(
        0,
        Math.min(100, progress_percentage)
      );
    if (order_index !== undefined) updateData.order_index = order_index;
    if (started_at !== undefined) updateData.started_at = started_at || null;
    if (completed_at !== undefined)
      updateData.completed_at = completed_at || null;

    const result = await typedUpdate("project_phases", updateData)
      .eq("id", phaseId)
      .select()
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating phase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      phase,
      message: "Phase updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]/phases/[phaseId]
 * Delete phase
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; phaseId: string } }
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
    const { phaseId } = params;

    if (!phaseId) {
      return NextResponse.json(
        { error: "Phase ID is required" },
        { status: 400 }
      );
    }

    const { error } = await typedTable("project_phases")
      .delete()
      .eq("id", phaseId);

    if (error) {
      console.error("Error deleting phase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Phase deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
