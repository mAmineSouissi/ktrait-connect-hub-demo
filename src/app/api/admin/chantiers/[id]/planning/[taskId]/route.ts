import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ChantierPlanningUpdate } from "@/types/supabase-database.types";

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
 * PUT /api/admin/chantiers/[id]/planning/[taskId]
 * Update a planning task
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
    const { taskId } = params;
    const data = await request.json();

    const updateData: ChantierPlanningUpdate = {};
    if (data.task_name !== undefined) updateData.task_name = data.task_name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.start_date !== undefined) updateData.start_date = data.start_date;
    if (data.end_date !== undefined) updateData.end_date = data.end_date;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.order_index !== undefined)
      updateData.order_index = data.order_index;

    const { data: task, error } = await typedTable("chantier_planning")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating planning task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/chantiers/[id]/planning/[taskId]
 * Delete a planning task
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
    const { taskId } = params;

    const { error } = await typedTable("chantier_planning")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Error deleting planning task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
