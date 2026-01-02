import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectTaskRow, ProjectTaskUpdate } from "@/types/supabase-database.types";

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
 * Verify partner is assigned to the project that contains this task
 */
async function verifyPartnerAccess(
  partnerId: string,
  taskId: string
): Promise<boolean> {
  try {
    // Get task's project_id
    const taskResult = await typedTable("project_tasks")
      .select("project_id")
      .eq("id", taskId)
      .single();

    const { data: task } = taskResult as {
      data: { project_id: string } | null;
      error: any;
    };

    if (!task) return false;

    // Verify partner is assigned to this project
    const projectPartnerResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", task.project_id)
      .eq("partner_id", partnerId)
      .single();

    const { data: projectPartner } = projectPartnerResult as {
      data: { id: string } | null;
      error: any;
    };

    return !!projectPartner;
  } catch (error) {
    return false;
  }
}

/**
 * PUT /api/partner/tasks/[taskId]
 * Update a task (only if partner is assigned to the project)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { taskId } = params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Verify partner has access to this task
    const hasAccess = await verifyPartnerAccess(partnerId, taskId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
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

    if (body.status !== undefined && body.status !== null) {
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
 * DELETE /api/partner/tasks/[taskId]
 * Delete a task (only if partner is assigned to the project)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { taskId } = params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Verify partner has access to this task
    const hasAccess = await verifyPartnerAccess(partnerId, taskId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
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

