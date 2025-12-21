import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { Document } from "@/types/document.types";
import type {
  DocumentRow,
  DocumentUpdate,
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
 * GET /api/admin/documents/[id]
 * Get document details
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const result = await typedTable("documents")
      .select("*")
      .eq("id", id)
      .single();

    const { data: document, error } = result as {
      data: DocumentRow | null;
      error: any;
    };

    if (error || !document) {
      console.error("Error fetching document:", error);
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json({ document });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/documents/[id]
 * Update document
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const {
      name,
      file_type,
      folder,
      file_url,
      file_size,
      status,
      client_id,
      project_id,
      partner_id,
    } = req.body;

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (file_type !== undefined) updateData.file_type = file_type;
    if (folder !== undefined) updateData.folder = folder;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (file_size !== undefined) updateData.file_size = file_size;
    if (status !== undefined) updateData.status = status;
    if (client_id !== undefined) updateData.client_id = client_id || null;
    if (project_id !== undefined) updateData.project_id = project_id || null;
    if (partner_id !== undefined) updateData.partner_id = partner_id || null;

    const result = await typedUpdate("documents", updateData as DocumentUpdate)
      .eq("id", id)
      .select()
      .single();

    const { data: document, error } = result as {
      data: DocumentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating document:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      document,
      message: "Document updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/documents/[id]
 * Delete document
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const { error } = await typedTable("documents").delete().eq("id", id);

    if (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Document deleted successfully",
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
