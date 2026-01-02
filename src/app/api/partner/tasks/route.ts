import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectTaskRow, ProjectTaskInsert } from "@/types/supabase-database.types";

/**
 * Get current partner ID from authenticated user
 */
async function getCurrentPartnerId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "partner") {
      return null;
    }

    // Get partner_id from partners_profile
    const profileResult = await typedTable("partners_profile")
      .select("partner_id")
      .eq("user_id", user.id)
      .single();

    const { data: profile } = profileResult as {
      data: { partner_id: string } | null;
      error: any;
    };

    return profile?.partner_id || null;
  } catch (error) {
    console.error("Error checking partner:", error);
    return null;
  }
}

/**
 * GET /api/partner/tasks
 * Get all tasks from projects assigned to the current partner
 * Query params: status, priority, project_id, limit, offset
 */
export async function GET(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const projectId = searchParams.get("project_id");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get all project IDs assigned to this partner
    const projectPartnersResult = await typedTable("project_partners")
      .select("project_id")
      .eq("partner_id", partnerId);

    const { data: projectPartners } = projectPartnersResult as {
      data: { project_id: string }[] | null;
      error: any;
    };

    if (!projectPartners || projectPartners.length === 0) {
      return NextResponse.json({ tasks: [], total: 0 });
    }

    const assignedProjectIds = projectPartners.map((pp) => pp.project_id);

    // If project_id filter is provided, verify it's in the assigned projects
    if (projectId && !assignedProjectIds.includes(projectId)) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Build query
    let tasksQuery = typedTable("project_tasks")
      .select(
        `
        *,
        assigned_user:users!project_tasks_assigned_to_fkey (
          id,
          full_name,
          email
        ),
        project:projects!project_tasks_project_id_fkey (
          id,
          name,
          status
        )
      `
      )
      .in("project_id", projectId ? [projectId] : assignedProjectIds);

    // Apply filters
    if (status) {
      tasksQuery = tasksQuery.eq("status", status);
    }

    if (priority) {
      tasksQuery = tasksQuery.eq("priority", priority);
    }

    // Order by due_date (nulls last), then by created_at
    const result = await tasksQuery
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: tasks, error } = result as {
      data: (ProjectTaskRow & {
        assigned_user: { id: string; full_name: string; email: string } | null;
        project: { id: string; name: string; status: string } | null;
      })[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = typedTable("project_tasks")
      .select("id", { count: "exact", head: true })
      .in("project_id", projectId ? [projectId] : assignedProjectIds);

    if (status) {
      countQuery = countQuery.eq("status", status);
    }

    if (priority) {
      countQuery = countQuery.eq("priority", priority);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      tasks: tasks || [],
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
 * POST /api/partner/tasks
 * Create a new task for a project (only if partner is assigned to the project)
 */
export async function POST(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      project_id,
      name,
      description,
      status = "à_faire",
      priority = "moyenne",
      assigned_to,
      due_date,
      start_date,
      progress = 0,
      order_index = 0,
    } = body;

    if (!project_id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    // Verify partner is assigned to this project
    const projectPartnerResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", project_id)
      .eq("partner_id", partnerId)
      .single();

    const { data: projectPartner } = projectPartnerResult as {
      data: { id: string } | null;
      error: any;
    };

    if (!projectPartner) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Verify project exists
    const projectResult = await typedTable("projects")
      .select("id")
      .eq("id", project_id)
      .single();

    const { data: project, error: projectError } = projectResult as {
      data: { id: string } | null;
      error: any;
    };

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Create task
    const taskData: ProjectTaskInsert = {
      project_id,
      name: name.trim(),
      description: description?.trim() || null,
      status,
      priority,
      assigned_to: assigned_to || null,
      due_date: due_date || null,
      start_date: start_date || null,
      progress: Math.max(0, Math.min(100, progress)),
      order_index,
    };

    const result = await typedInsert("project_tasks", taskData);

    const { data: task, error } = result as {
      data: ProjectTaskRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

