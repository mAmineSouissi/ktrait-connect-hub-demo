import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectTaskRow,
  ProjectTaskInsert,
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
 * GET /api/admin/projects/[id]/tasks
 * List all tasks for a project
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

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("project_tasks")
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
          name
        )
      `
      )
      .eq("project_id", id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const { data: tasks, error } = result as {
      data: (ProjectTaskRow & {
        assigned_user: { id: string; full_name: string; email: string } | null;
        project: { id: string; name: string } | null;
      })[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: tasks || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects/[id]/tasks
 * Create a new task for a project
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
      status = "à_faire",
      priority = "moyenne",
      assigned_to,
      due_date,
      start_date,
      progress = 0,
      order_index = 0,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    // Verify project exists
    const projectResult = await typedTable("projects")
      .select("id")
      .eq("id", id)
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

    const taskData: ProjectTaskInsert = {
      project_id: id,
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

