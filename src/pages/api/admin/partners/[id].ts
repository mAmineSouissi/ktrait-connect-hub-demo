import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type {
  PartnerRow,
  PartnerUpdate,
  UserRow,
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
 * GET /api/admin/partners/[id]
 * Get partner details with all related data
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
      return res.status(400).json({ error: "Partner ID is required" });
    }

    // Get partner
    const result = await typedTable("partners")
      .select("*")
      .eq("id", id)
      .single();

    const { data: partner, error } = result as {
      data: PartnerRow | null;
      error: any;
    };

    if (error || !partner) {
      console.error("Error fetching partner:", error);
      return res.status(404).json({
        error: "Partner not found",
        details: error?.message,
      });
    }

    // Get user info if partner has a user account
    let userInfo = null;
    const profileResult = await typedTable("partners_profile")
      .select("user_id")
      .eq("partner_id", id)
      .single();

    const { data: profile } = profileResult as {
      data: { user_id: string } | null;
      error: any;
    };

    if (profile?.user_id) {
      const userResult = await typedTable("users")
        .select("id, full_name, email, phone")
        .eq("id", profile.user_id)
        .single();

      const { data: userData } = userResult as {
        data: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
        } | null;
        error: any;
      };

      if (userData) {
        userInfo = {
          id: userData.id,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone || null,
        };
      }
    }

    // Get projects where this partner is assigned
    const projectsResult = await typedTable("project_partners")
      .select(
        `
        *,
        project:projects(
          id,
          name,
          status,
          client:users!projects_client_id_fkey(id, full_name)
        )
      `
      )
      .eq("partner_id", id);

    const { data: projectPartners } = projectsResult as {
      data: any[] | null;
      error: any;
    };

    const projects = (projectPartners || []).map((pp: any) => ({
      id: pp.project?.id || "",
      name: pp.project?.name || "",
      status: pp.project?.status || "",
      client_name: pp.project?.client?.full_name || "",
      role: pp.role || null,
      is_primary: pp.is_primary || false,
    }));

    // Get documents count
    const docsCountResult = await typedTable("documents")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", id);

    const { count: documentsCount } = docsCountResult as {
      count: number | null;
      error: any;
    };

    // Get certifications
    const certificationsResult = await typedTable("partner_certifications")
      .select("*")
      .eq("partner_id", id)
      .order("issue_date", { ascending: false });

    const { data: certifications } = certificationsResult as {
      data: any[] | null;
      error: any;
    };

    // Get personal projects (portfolio)
    const personalProjectsResult = await typedTable("partner_personal_projects")
      .select("*")
      .eq("partner_id", id)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: personalProjects } = personalProjectsResult as {
      data: any[] | null;
      error: any;
    };

    // Get gallery items
    const galleryResult = await typedTable("partner_gallery")
      .select("*")
      .eq("partner_id", id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const { data: gallery } = galleryResult as {
      data: any[] | null;
      error: any;
    };

    const partnerWithDetails = {
      ...partner,
      user: userInfo,
      projects: projects || [],
      projects_count: projects.length,
      documents_count: documentsCount || 0,
      certifications: certifications || [],
      personal_projects: personalProjects || [],
      gallery: gallery || [],
    };

    return res.status(200).json({
      partner: partnerWithDetails,
    });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/partners/[id]
 * Update partner
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Partner ID is required" });
    }

    const {
      name,
      type,
      contact_person,
      email,
      phone,
      address,
      city,
      postal_code,
      status,
      since_date,
      notes,
    } = req.body;

    // Build update object
    const updateData: PartnerUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (contact_person !== undefined)
      updateData.contact_person = contact_person || null;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address !== undefined) updateData.address = address || null;
    if (city !== undefined) updateData.city = city || null;
    if (postal_code !== undefined) updateData.postal_code = postal_code || null;
    if (status !== undefined) updateData.status = status;
    if (since_date !== undefined) updateData.since_date = since_date || null;
    if (notes !== undefined) updateData.notes = notes || null;

    const result = await typedUpdate("partners", updateData)
      .eq("id", id)
      .select("*")
      .single();

    const { data: partner, error } = result as {
      data: PartnerRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating partner:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      partner,
      message: "Partner updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/partners/[id]
 * Delete partner
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Partner ID is required" });
    }

    const { error } = await typedTable("partners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting partner:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Partner deleted successfully",
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
