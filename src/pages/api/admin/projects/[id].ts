import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
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
async function isAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const supabase = createApiRouteClient(req, res);
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
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Project ID is required" });
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
      return res.status(404).json({
        error: "Project not found",
        details: projectError?.message,
      });
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

    return res.status(200).json({ project: projectWithDetails });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update project
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const {
      name,
      description,
      status,
      progress,
      estimated_budget,
      start_date,
      end_date,
      address,
    } = req.body;

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
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      project,
      message: "Project updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete project (hard delete - cascades to related tables)
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Delete project (cascades to phases, partners, documents, expenses, gallery)
    const { error } = await typedTable("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in handleDelete:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  }
  if (req.method === "PUT") {
    return handlePut(req, res);
  }
  if (req.method === "DELETE") {
    return handleDelete(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
