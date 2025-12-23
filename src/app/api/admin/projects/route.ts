import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { Project, ProjectWithDetails } from "@/types/project.types";
import type {
  ProjectRow,
  ProjectInsert,
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
 * GET /api/admin/projects
 * List all projects with filters and pagination
 * Query params: search, client_id, status, limit, offset
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
    const client_id = searchParams.get("client_id");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Get projects first
    let query = (supabaseAdmin.from("projects") as any).select("*", {
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
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (client_id) {
      query = query.eq("client_id", client_id as string);
    }
    if (status) {
      query = query.eq("status", status as string);
    }

    const { data: projects, error, count } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get client info for each project
    const projectsWithClients = await Promise.all(
      (projects || []).map(async (project: ProjectRow) => {
        const clientResult = await typedTable("users")
          .select("id, full_name, email, phone")
          .eq("id", project.client_id)
          .single();
        const { data: client } = clientResult as {
          data: {
            id: string;
            full_name: string;
            email: string;
            phone?: string | null;
          } | null;
          error: any;
        };

        return {
          ...project,
          client: client || null,
        };
      })
    );

    return NextResponse.json({
      projects: projectsWithClients,
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

/**
 * POST /api/admin/projects
 * Create a new project
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
    const body = await request.json();
    const {
      client_id,
      name,
      description,
      status = "planifié",
      estimated_budget,
      start_date,
      end_date,
      address,
      category,
      type,
    } = body;

    // Validate required fields
    if (!client_id || !name) {
      return NextResponse.json(
        {
          error: "client_id and name are required",
        },
        { status: 400 }
      );
    }

    // Verify client exists
    const { data: clientExists } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", client_id)
      .single();

    if (!clientExists) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    // Create project with proper typing
    const projectData: ProjectInsert = {
      client_id,
      name,
      description,
      status,
      estimated_budget: estimated_budget ? parseFloat(estimated_budget) : null,
      start_date: start_date || null,
      end_date: end_date || null,
      address: address || null,
      category: category || null,
      type: type || null,
      progress: 0,
      spent_amount: 0,
    };

    const result = await typedInsert("projects", projectData)
      .select("*")
      .single();

    const { data: project, error } = result as {
      data: ProjectRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        project,
        message: "Project created successfully",
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
