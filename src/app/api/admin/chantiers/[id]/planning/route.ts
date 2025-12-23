import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierPlanningInsert,
} from "@/types/supabase-database.types";

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
 * GET /api/admin/chantiers/[id]/planning
 * Get all planning tasks for a chantier
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

    const { data: planning, error } = await typedTable("chantier_planning")
      .select("*")
      .eq("chantier_id", id)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching planning:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ planning: planning || [] });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/chantiers/[id]/planning
 * Create a new planning task
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
    const data = await request.json();

    if (!data.task_name) {
      return NextResponse.json(
        { error: "task_name is required" },
        { status: 400 }
      );
    }

    const insertData: ChantierPlanningInsert = {
      chantier_id: id,
      task_name: data.task_name,
      description: data.description || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      progress: data.progress || 0,
      order_index: data.order_index || 0,
    };

    const { data: task, error } = await typedTable("chantier_planning")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating planning task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
