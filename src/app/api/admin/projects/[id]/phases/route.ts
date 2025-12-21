import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectPhase } from "@/types/project.types";
import type {
  ProjectPhaseRow,
  ProjectPhaseInsert,
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
 * GET /api/admin/projects/[id]/phases
 * List all phases for a project
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

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("project_phases")
      .select("*")
      .eq("project_id", id)
      .order("order_index", { ascending: true });

    const { data: phases, error } = result as {
      data: ProjectPhaseRow[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching phases:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ phases: phases || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects/[id]/phases
 * Create a new phase for a project
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
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      status = "à_venir",
      progress_percentage = 0,
      order_index,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        {
          error: "name is required",
        },
        { status: 400 }
      );
    }

    // Get current max order_index if not provided
    let finalOrderIndex = order_index;
    if (finalOrderIndex === undefined) {
      const existingPhasesResult = await typedTable("project_phases")
        .select("order_index")
        .eq("project_id", id)
        .order("order_index", { ascending: false })
        .limit(1);
      const { data: existingPhases } = existingPhasesResult as {
        data: { order_index: number }[] | null;
        error: any;
      };

      finalOrderIndex =
        existingPhases && existingPhases.length > 0
          ? (existingPhases[0].order_index || 0) + 1
          : 0;
    }

    // Create phase with proper typing
    const phaseData: ProjectPhaseInsert = {
      project_id: id,
      name,
      description: description || null,
      status,
      progress_percentage: Math.max(0, Math.min(100, progress_percentage)),
      order_index: finalOrderIndex,
    };

    const result = await typedInsert("project_phases", phaseData)
      .select()
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating phase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        phase,
        message: "Phase created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
