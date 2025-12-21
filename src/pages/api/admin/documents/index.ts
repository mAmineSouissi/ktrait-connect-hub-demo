import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";

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
 * GET /api/admin/documents
 * List all documents with filters
 * Query params: client_id, project_id, partner_id, folder, status, limit, offset
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const {
      client_id,
      project_id,
      partner_id,
      folder,
      status,
      limit = "100",
      offset = "0",
    } = req.query;

    let query = typedTable("documents").select(
      `
      *,
      client:users!documents_client_id_fkey (
        full_name
      ),
      project:projects!documents_project_id_fkey (
        name
      ),
      partner:partners!documents_partner_id_fkey (
        name
      )
      `,
      { count: "exact" }
    );

    // Filters (GOOD as-is)
    if (client_id) query = query.eq("client_id", client_id as string);
    if (project_id) query = query.eq("project_id", project_id as string);
    if (partner_id) query = query.eq("partner_id", partner_id as string);
    if (folder) query = query.eq("folder", folder as string);
    if (status) query = query.eq("status", status as string);

    query = query.order("uploaded_at", { ascending: false });

    const { data, error, count } = await query.range(
      Number(offset),
      Number(offset) + Number(limit) - 1
    );

    if (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ error: error.message });
    }

    const documentsWithDetails = (data || []).map((doc: any) => ({
      ...doc,
      client_name: doc.client?.full_name ?? null,
      project_name: doc.project?.name ?? null,
      partner_name: doc.partner?.name ?? null,
    }));

    return res.status(200).json({
      documents: documentsWithDetails,
      total: count ?? 0,
    });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}

/**
 * POST /api/admin/documents
 * Create a new document
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const {
      client_id,
      project_id,
      partner_id,
      name,
      file_type,
      folder,
      file_url,
      file_size,
      status = "en_attente",
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: "name is required",
      });
    }

    // Ensure at least one relation exists
    if (!client_id && !project_id && !partner_id) {
      return res.status(400).json({
        error:
          "At least one of client_id, project_id, or partner_id is required",
      });
    }

    // Create document
    const { data: document, error } = await (
      supabaseAdmin.from("documents") as any
    )
      .insert({
        client_id: client_id || null,
        project_id: project_id || null,
        partner_id: partner_id || null,
        name,
        file_type: file_type || null,
        folder: folder || null,
        file_url: file_url || null,
        file_size: file_size || null,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating document:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      document,
      message: "Document created successfully",
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
