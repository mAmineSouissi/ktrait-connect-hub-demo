import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectRow, ProjectInsert } from "@/types/supabase-database.types";

/**
 * Check if the current user is a client and get their ID
 */
async function getCurrentClientId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "client") {
      return userData.id;
    }

    return null;
  } catch (error) {
    console.error("Error checking client:", error);
    return null;
  }
}

/**
 * GET /api/client/projects
 * List projects for the current client (read-only)
 * Query params: search, status, limit, offset, sortKey, order
 */
export async function GET(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Get projects for this client only
    let query = (typedTable("projects") as any).select("*", {
      count: "exact",
    });

    // Always filter by client_id
    query = query.eq("client_id", clientId);

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
    if (status) {
      query = query.eq("status", status as string);
    }

    const { data: projects, error, count } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get partners info for each project (read-only)
    const projectsWithPartners = await Promise.all(
      (projects || []).map(async (project: ProjectRow) => {
        // Get project partners
        const partnersResult = await typedTable("project_partners")
          .select(
            `
            *,
            partner:partners(id, name, type, contact_person, email, phone)
          `
          )
          .eq("project_id", project.id);
        
        const { data: projectPartners } = partnersResult as {
          data: any[] | null;
          error: any;
        };

        return {
          ...project,
          partners: projectPartners || [],
        };
      })
    );

    return NextResponse.json({
      projects: projectsWithPartners,
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
 * POST /api/client/projects
 * Create a new project for the current client
 */
export async function POST(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
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
    if (!name) {
      return NextResponse.json(
        {
          error: "name is required",
        },
        { status: 400 }
      );
    }

    // Create project with proper typing (client_id is automatically set)
    const projectData: ProjectInsert = {
      client_id: clientId, // Automatically set to current client
      name,
      description,
      status,
      estimated_budget: estimated_budget ? parseFloat(estimated_budget.toString()) : null,
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

