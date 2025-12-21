import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type {
  ProjectPartnerRow,
  ProjectPartnerUpdate,
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
 * PUT /api/admin/projects/[id]/partners/[partnerId]
 * Update project partner relationship
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { partnerId } = req.query;

    if (!partnerId || typeof partnerId !== "string") {
      return res.status(400).json({ error: "Partner ID is required" });
    }

    const { role, is_primary } = req.body;

    // Build update object with proper typing
    const updateData: ProjectPartnerUpdate = {};
    if (role !== undefined) updateData.role = role || null;
    if (is_primary !== undefined) {
      updateData.is_primary = is_primary;

      // If setting as primary, unset other primary partners for this project
      if (is_primary) {
        const currentResult = await typedTable("project_partners")
          .select("project_id")
          .eq("id", partnerId)
          .single();

        const { data: current } = currentResult as {
          data: { project_id: string } | null;
          error: any;
        };

        if (current) {
          await typedTable("project_partners")
            .update({ is_primary: false })
            .eq("project_id", current.project_id)
            .eq("is_primary", true)
            .neq("id", partnerId);
        }
      }
    }

    const result = await typedUpdate("project_partners", updateData)
      .eq("id", partnerId)
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone, address, city, status)
      `
      )
      .single();

    const { data: projectPartner, error } = result as {
      data: (ProjectPartnerRow & { partner: any }) | null;
      error: any;
    };

    if (error) {
      console.error("Error updating project partner:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      projectPartner: {
        id: projectPartner?.id,
        project_id: projectPartner?.project_id,
        partner_id: projectPartner?.partner_id,
        role: projectPartner?.role,
        is_primary: projectPartner?.is_primary,
        created_at: projectPartner?.created_at,
        partner: projectPartner?.partner || null,
      },
      message: "Project partner updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/projects/[id]/partners/[partnerId]
 * Remove partner from project
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { partnerId } = req.query;

    if (!partnerId || typeof partnerId !== "string") {
      return res.status(400).json({ error: "Partner ID is required" });
    }

    const { error } = await typedTable("project_partners")
      .delete()
      .eq("id", partnerId);

    if (error) {
      console.error("Error deleting project partner:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Partner removed from project successfully",
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
  if (req.method === "PUT") {
    return handlePut(req, res);
  }
  if (req.method === "DELETE") {
    return handleDelete(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
