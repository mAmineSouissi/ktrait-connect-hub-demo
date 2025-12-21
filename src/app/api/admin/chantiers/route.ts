import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierWithCounts,
  ChantierListResponse,
  CreateChantierRequest,
} from "@/types/chantier.types";
import type {
  ChantierRow,
  ChantierInsert,
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
    return false;
  }
}

/**
 * GET /api/admin/chantiers
 * List all chantiers with filters and pagination
 * Query params: search, project_id, status, limit, offset
 */
export async function GET(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Get chantiers first
    let query = (supabaseAdmin.from("chantiers") as any).select("*", {
      count: "exact",
    });

    // Apply sorting
    const sortField = sortKey as string;
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortField, { ascending });

    query = query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
    if (project_id) {
      query = query.eq("project_id", project_id as string);
    }
    if (status) {
      query = query.eq("status", status as string);
    }

    const { data: chantiers, error, count } = await query;

    if (error) {
      console.error("Error fetching chantiers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get project info and counts for each chantier
    const chantiersWithCounts: ChantierWithCounts[] = await Promise.all(
      (chantiers || []).map(async (chantier: ChantierRow) => {
        // Get project info
        const projectResult = await typedTable("projects")
          .select("id, name, client_id")
          .eq("id", chantier.project_id)
          .single();

        const project = projectResult.data || null;

        // Get counts
        const teamCountResult = await typedTable("chantier_team")
          .select("*", { count: "exact", head: true })
          .eq("chantier_id", chantier.id);

        const planningCountResult = await typedTable("chantier_planning")
          .select("*", { count: "exact", head: true })
          .eq("chantier_id", chantier.id);

        const galleryCountResult = await typedTable("chantier_gallery")
          .select("*", { count: "exact", head: true })
          .eq("chantier_id", chantier.id);

        const notesCountResult = await typedTable("chantier_notes")
          .select("*", { count: "exact", head: true })
          .eq("chantier_id", chantier.id);

        return {
          ...chantier,
          project: project
            ? {
                id: project.id,
                name: project.name,
                client_id: project.client_id,
              }
            : null,
          team_count: teamCountResult.count || 0,
          planning_count: planningCountResult.count || 0,
          gallery_count: galleryCountResult.count || 0,
          notes_count: notesCountResult.count || 0,
        };
      })
    );

    const response: ChantierListResponse = {
      chantiers: chantiersWithCounts,
      total: count || 0,
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
 * POST /api/admin/chantiers
 * Create a new chantier
 */
export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const data: CreateChantierRequest = await request.json();

    // Validation
    if (!data.project_id || !data.name || !data.location) {
      return NextResponse.json(
        { error: "project_id, name, and location are required" },
        { status: 400 }
      );
    }

    // Verify project exists
    const projectCheck = await typedTable("projects")
      .select("id")
      .eq("id", data.project_id)
      .single();

    if (!projectCheck.data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create chantier
    const insertData: ChantierInsert = {
      project_id: data.project_id,
      name: data.name,
      location: data.location,
      description: data.description || null,
      status: data.status || "planifié",
      progress: data.progress || 0,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
    };

    const { data: chantier, error } = await typedTable("chantiers")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating chantier:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chantier }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
