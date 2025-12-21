import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { ProjectGalleryItem } from "@/types/gallery.types";
import type {
  ProjectGalleryRow,
  ProjectGalleryUpdate,
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
 * GET /api/admin/projects/[id]/gallery/[galleryId]
 * Get gallery item by ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = req.query;

    if (!galleryId || typeof galleryId !== "string") {
      return res.status(400).json({ error: "Gallery ID is required" });
    }

    const result = await typedTable("project_gallery")
      .select("*")
      .eq("id", galleryId)
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching gallery item:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!galleryItem) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    return res.status(200).json({ galleryItem });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/projects/[id]/gallery/[galleryId]
 * Update gallery item
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = req.query;

    if (!galleryId || typeof galleryId !== "string") {
      return res.status(400).json({ error: "Gallery ID is required" });
    }

    const { title, description, media_type, file_url, thumbnail_url, date } =
      req.body;

    // Build update object with proper typing
    const updateData: ProjectGalleryUpdate = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (media_type !== undefined) updateData.media_type = media_type;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (date !== undefined) updateData.date = date || null;

    const result = await typedUpdate("project_gallery", updateData)
      .eq("id", galleryId)
      .select()
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating gallery item:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      galleryItem,
      message: "Gallery item updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/projects/[id]/gallery/[galleryId]
 * Delete gallery item
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = req.query;

    if (!galleryId || typeof galleryId !== "string") {
      return res.status(400).json({ error: "Gallery ID is required" });
    }

    const { error } = await typedTable("project_gallery")
      .delete()
      .eq("id", galleryId);

    if (error) {
      console.error("Error deleting gallery item:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Gallery item deleted successfully",
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
