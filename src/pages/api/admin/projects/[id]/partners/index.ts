import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type {
  ProjectPartnerRow,
  ProjectPartnerInsert,
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
 * GET /api/admin/projects/[id]/partners
 * List all partners for a project
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

    const result = await typedTable("project_partners")
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone, address, city, status)
      `
      )
      .eq("project_id", id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    const { data: projectPartners, error } = result as {
      data: (ProjectPartnerRow & { partner: any })[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching project partners:", error);
      return res.status(500).json({ error: error.message });
    }

    // Format partners properly
    const formattedPartners = (projectPartners || []).map((pp) => ({
      id: pp.id,
      project_id: pp.project_id,
      partner_id: pp.partner_id,
      role: pp.role,
      is_primary: pp.is_primary,
      created_at: pp.created_at,
      partner: pp.partner || null,
    }));

    return res.status(200).json({ partners: formattedPartners });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/projects/[id]/partners
 * Add a partner to a project
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
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

    const { partner_id, role, is_primary } = req.body;

    // Validate required fields
    if (!partner_id) {
      return res.status(400).json({
        error: "partner_id is required",
      });
    }

    // Check if partner already exists for this project
    const existingResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", id)
      .eq("partner_id", partner_id)
      .single();

    const { data: existing } = existingResult as {
      data: { id: string } | null;
      error: any;
    };

    if (existing) {
      return res.status(400).json({
        error: "This partner is already assigned to this project",
      });
    }

    // If setting as primary, unset other primary partners
    if (is_primary) {
      await typedTable("project_partners")
        .update({ is_primary: false })
        .eq("project_id", id)
        .eq("is_primary", true);
    }

    // Create project partner relationship
    const partnerData: ProjectPartnerInsert = {
      project_id: id,
      partner_id,
      role: role || null,
      is_primary: is_primary || false,
    };

    const result = await typedInsert("project_partners", partnerData)
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
      console.error("Error creating project partner:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      projectPartner: {
        id: projectPartner?.id,
        project_id: projectPartner?.project_id,
        partner_id: projectPartner?.partner_id,
        role: projectPartner?.role,
        is_primary: projectPartner?.is_primary,
        created_at: projectPartner?.created_at,
        partner: projectPartner?.partner || null,
      },
      message: "Partner added to project successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePost:", error);
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
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
