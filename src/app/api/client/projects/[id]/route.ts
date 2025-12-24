import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectRow,
  ProjectPhaseRow,
  ProjectPartnerRow,
  ExpenseRow,
  PaymentRow,
  ProjectUpdate,
} from "@/types/supabase-database.types";
import type { ProjectWithDetails } from "@/types/project.types";

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
 * GET /api/client/projects/[id]
 * Get project details for the current client (read-only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
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

    // Get the project and verify it belongs to this client
    const projectResult = await typedTable("projects")
      .select("*")
      .eq("id", id)
      .eq("client_id", clientId) // Ensure it belongs to the client
      .single();

    const { data: project, error: projectError } = projectResult as {
      data: ProjectRow | null;
      error: any;
    };

    if (projectError || !project) {
      console.error("Error fetching project:", projectError);
      return NextResponse.json(
        {
          error: "Project not found or access denied",
          details: projectError?.message,
        },
        { status: 404 }
      );
    }

    // Get client info (for consistency with admin API structure)
    const clientResult = await typedTable("users")
      .select("id, full_name, email, phone")
      .eq("id", clientId)
      .single();
    const { data: clientUserData } = clientResult as {
      data: { id: string; full_name: string; email: string; phone?: string | null } | null;
      error: any;
    };

    // Get address and city from clients table if available
    const clientAddressResult = await typedTable("clients")
      .select("address, city")
      .eq("user_id", clientId)
      .single();
    const { data: clientAddress } = clientAddressResult as {
      data: { address?: string | null; city?: string | null } | null;
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

    // Get payments total - only count payments with status "payé" for this specific client's project
    const paymentsResult = await typedTable("payments")
      .select("amount")
      .eq("project_id", id)
      .eq("client_id", clientId) // Ensure payment belongs to this client
      .eq("status", "payé"); // Only count fully paid payments
    const { data: payments } = paymentsResult as {
      data: PaymentRow[] | null;
      error: any;
    };

    const paymentsTotal =
      payments?.reduce(
        (sum, pay) => sum + parseFloat(pay.amount.toString()),
        0
      ) || 0;

    // Get chantiers (construction sites) for this project
    const chantiersResult = await typedTable("chantiers")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });
    const { data: chantiers } = chantiersResult as {
      data: any[] | null;
      error: any;
    };

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

    // Calculate spent_amount from expenses if not already set
    const spentAmount = project.spent_amount || expensesTotal;

    const projectWithDetails = {
      ...projectWithClient,
      spent_amount: spentAmount,
      phases: phases || [],
      partners: formattedPartners,
      documents_count: documentsCount || 0,
      expenses_total: expensesTotal,
      payments_total: paymentsTotal,
      chantiers: chantiers || [],
    } as ProjectWithDetails & { chantiers: any[] };

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
 * PUT /api/client/projects/[id]
 * Update project (only if it belongs to the current client)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
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

    // First verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();

    const { data: projectExists, error: checkError } = projectCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (checkError || !projectExists) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
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

    // Build update data (only include provided fields)
    const updateData: ProjectUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (estimated_budget !== undefined) {
      updateData.estimated_budget = estimated_budget
        ? parseFloat(estimated_budget.toString())
        : null;
    }
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;
    if (address !== undefined) updateData.address = address || null;
    if (category !== undefined) updateData.category = category || null;
    if (type !== undefined) updateData.type = type || null;

    // Update the project
    const result = await typedTable("projects")
      .update(updateData)
      .eq("id", id)
      .eq("client_id", clientId) // Double-check ownership
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

    return NextResponse.json(
      {
        project,
        message: "Project updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

