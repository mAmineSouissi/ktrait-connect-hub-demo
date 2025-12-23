import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectWithDetails } from "@/types/project.types";
import type {
  ProjectRow,
  ProjectUpdate,
  ProjectPhaseRow,
  ProjectPartnerRow,
  ExpenseRow,
  PaymentRow,
  UserRow,
  ClientRow,
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
 * GET /api/admin/projects/[id]
 * Get project details with all related data (phases, partners, documents count, etc.)
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
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // First, get the project
    const projectResult = await typedTable("projects")
      .select("*")
      .eq("id", id)
      .single();

    const { data: project, error: projectError } = projectResult as {
      data: ProjectRow | null;
      error: any;
    };

    if (projectError || !project) {
      console.error("Error fetching project:", projectError);
      return NextResponse.json(
        {
          error: "Project not found",
          details: projectError?.message,
        },
        { status: 404 }
      );
    }

    // Get client info separately
    const clientResult = await typedTable("users")
      .select("id, full_name, email, phone")
      .eq("id", project.client_id)
      .single();
    const { data: clientUserData } = clientResult as {
      data: Pick<UserRow, "id" | "full_name" | "email" | "phone"> | null;
      error: any;
    };

    // Get address and city from clients table if available
    const clientAddressResult = await typedTable("clients")
      .select("address, city")
      .eq("user_id", project.client_id)
      .single();
    const { data: clientAddress } = clientAddressResult as {
      data: Pick<ClientRow, "address" | "city"> | null;
      error: any;
    };

    const client = clientUserData
      ? {
          id: clientUserData.id,
          full_name: clientUserData.full_name,
          email: clientUserData.email,
          phone: clientUserData.phone || null,
          address: clientAddress?.address || null,
          city: clientAddress?.city || null,
        }
      : null;

    // Combine project with client data
    const projectWithClient = {
      ...project,
      client: client || null,
    };

    // Get project phases
    const phasesResult = await typedTable("project_phases")
      .select("*")
      .eq("project_id", id)
      .order("order_index", { ascending: true });
    const { data: phases } = phasesResult as {
      data: ProjectPhaseRow[] | null;
      error: any;
    };

    // Get project partners
    const partnersResult = await typedTable("project_partners")
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone)
      `
      )
      .eq("project_id", id);
    const { data: projectPartners } = partnersResult as {
      data: ProjectPartnerRow[] | null;
      error: any;
    };

    // Get documents count
    const docsCountResult = await typedTable("documents")
      .select("*", { count: "exact", head: true })
      .eq("project_id", id);
    const { count: documentsCount } = docsCountResult as {
      count: number | null;
      error: any;
    };

    // Get expenses total
    const expensesResult = await typedTable("expenses")
      .select("amount")
      .eq("project_id", id);
    const { data: expenses } = expensesResult as {
      data: ExpenseRow[] | null;
      error: any;
    };

    const expensesTotal =
      expenses?.reduce(
        (sum, exp) => sum + parseFloat(exp.amount.toString()),
        0
      ) || 0;

    // Get payments total (if any linked to this project)
    const paymentsResult = await typedTable("payments")
      .select("amount")
      .eq("project_id", id)
      .eq("status", "payé");
    const { data: payments } = paymentsResult as {
      data: PaymentRow[] | null;
      error: any;
    };

    const paymentsTotal =
      payments?.reduce(
        (sum, pay) => sum + parseFloat(pay.amount.toString()),
        0
      ) || 0;

    // Format partners properly
    const formattedPartners = (projectPartners || []).map((pp: any) => ({
      id: pp.id,
      project_id: pp.project_id,
      partner_id: pp.partner_id,
      role: pp.role,
      is_primary: pp.is_primary,
      created_at: pp.created_at,
      partner: pp.partner || null,
    }));

    const projectWithDetails = {
      ...projectWithClient,
      phases: phases || [],
      partners: formattedPartners,
      documents_count: documentsCount || 0,
      expenses_total: expensesTotal,
      payments_total: paymentsTotal,
    } as ProjectWithDetails;

    return NextResponse.json({ project: projectWithDetails });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update project
 */
export async function PUT(
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
    const supabaseAdmin = getSupabaseAdmin();
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
      status,
      progress,
      estimated_budget,
      start_date,
      end_date,
      address,
      category,
      type,
    } = body;

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined)
      updateData.progress = Math.max(0, Math.min(100, parseInt(progress)));
    if (estimated_budget !== undefined)
      updateData.estimated_budget = estimated_budget
        ? parseFloat(estimated_budget)
        : null;
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;
    if (address !== undefined) updateData.address = address || null;
    if (category !== undefined) updateData.category = category || null;
    if (type !== undefined) updateData.type = type || null;

    const result = await typedUpdate("projects", updateData as ProjectUpdate)
      .eq("id", id)
      .select("*")
      .single();

    const { data: project, error } = result as {
      data: ProjectRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      project,
      message: "Project updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete project (hard delete - cascades to related tables)
 */
export async function DELETE(
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
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete project (cascades to phases, partners, documents, expenses, gallery)
    const { error } = await typedTable("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Project deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
