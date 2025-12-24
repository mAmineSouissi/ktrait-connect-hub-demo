import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierRow,
  ChantierInsert,
} from "@/types/supabase-database.types";

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
 * GET /api/client/chantiers
 * List chantiers for the current client's projects
 * Query params: project_id, status, limit, offset
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
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    // If project_id is provided, verify it belongs to this client
    if (project_id) {
      const projectCheck = await typedTable("projects")
        .select("id, client_id")
        .eq("id", project_id)
        .eq("client_id", clientId)
        .single();
      
      const { data: projectExists } = projectCheck as {
        data: { id: string; client_id: string } | null;
        error: any;
      };

      if (!projectExists) {
        return NextResponse.json({
          chantiers: [],
          total: 0,
        });
      }
    }

    // Get chantiers for projects belonging to this client
    let query = typedTable("chantiers")
      .select(
        `
        *,
        project:projects!chantiers_project_id_fkey (
          id,
          name,
          client_id
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Filter by project if provided
    if (project_id) {
      query = query.eq("project_id", project_id);
    } else {
      // Filter by client's projects
      const clientProjects = await typedTable("projects")
        .select("id")
        .eq("client_id", clientId);
      
      const { data: projects } = clientProjects as {
        data: { id: string }[] | null;
        error: any;
      };

      if (projects && projects.length > 0) {
        const projectIds = projects.map((p) => p.id);
        query = query.in("project_id", projectIds);
      } else {
        return NextResponse.json({
          chantiers: [],
          total: 0,
        });
      }
    }

    if (status) {
      query = query.eq("status", status);
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: chantiers,
      error,
      count,
    } = result as {
      data: (ChantierRow & { project?: { id: string; name: string; client_id: string } })[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching chantiers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out any chantiers that don't belong to client's projects
    const filteredChantiers = (chantiers || []).filter((chantier) => {
      if (chantier.project) {
        return chantier.project.client_id === clientId;
      }
      return false;
    });

    return NextResponse.json({
      chantiers: filteredChantiers,
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
 * POST /api/client/chantiers
 * Create a new chantier for the current client's project
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
      project_id,
      name,
      location,
      description,
      status,
      progress,
      start_date,
      end_date,
    } = body;

    // Validate required fields
    if (!project_id || !name || !location) {
      return NextResponse.json(
        { error: "project_id, name, and location are required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", project_id)
      .eq("client_id", clientId)
      .single();
    
    const { data: projectExists, error: projectError } = projectCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (projectError || !projectExists) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Create chantier
    const insertData: ChantierInsert = {
      project_id,
      name,
      location,
      description: description || null,
      status: status || "planifié",
      progress: progress || 0,
      start_date: start_date || null,
      end_date: end_date || null,
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
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

