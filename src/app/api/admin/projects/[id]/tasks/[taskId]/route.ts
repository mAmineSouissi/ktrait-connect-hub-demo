import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectTaskRow,
  ProjectTaskUpdate,
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
 * PUT /api/admin/projects/[id]/tasks/[taskId]
 * Update a task
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id, taskId } = params;

    if (!id || !taskId) {
      return NextResponse.json(
        { error: "Project ID and Task ID are required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: ProjectTaskUpdate = {};

    if (body.name !== undefined) {
      if (!body.name || !body.name.trim()) {
        return NextResponse.json(
          { error: "Task name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    if (body.assigned_to !== undefined) {
      updateData.assigned_to = body.assigned_to || null;
    }

    if (body.due_date !== undefined) {
      updateData.due_date = body.due_date || null;
    }

    if (body.start_date !== undefined) {
      updateData.start_date = body.start_date || null;
    }

    if (body.progress !== undefined) {
      updateData.progress = Math.max(0, Math.min(100, body.progress));
    }

    if (body.order_index !== undefined) {
      updateData.order_index = body.order_index;
    }

    // If status is "terminé", set completed_at
    if (body.status === "terminé" && !body.completed_at) {
      updateData.completed_at = new Date().toISOString();
    } else if (body.status !== "terminé" && body.completed_at === null) {
      updateData.completed_at = null;
    }

    // Verify task exists and belongs to project
    const taskResult = await typedTable("project_tasks")
      .select("id, project_id")
      .eq("id", taskId)
      .eq("project_id", id)
      .single();

    const { data: task, error: taskError } = taskResult as {
      data: { id: string; project_id: string } | null;
      error: any;
    };

    if (taskError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task and return the updated data
    const updateResult = await typedTable("project_tasks")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    const { data: updatedTask, error } = updateResult as {
      data: ProjectTaskRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]/tasks/[taskId]
 * Delete a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id, taskId } = params;

    if (!id || !taskId) {
      return NextResponse.json(
        { error: "Project ID and Task ID are required" },
        { status: 400 }
      );
    }

    // Verify task exists and belongs to project
    const taskResult = await typedTable("project_tasks")
      .select("id, project_id")
      .eq("id", taskId)
      .eq("project_id", id)
      .single();

    const { data: task, error: taskError } = taskResult as {
      data: { id: string; project_id: string } | null;
      error: any;
    };

    if (taskError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const result = await typedTable("project_tasks")
      .delete()
      .eq("id", taskId)
      .select()
      .single();

    const { error } = result as {
      data: ProjectTaskRow | null;
      error: any;
    };

    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
