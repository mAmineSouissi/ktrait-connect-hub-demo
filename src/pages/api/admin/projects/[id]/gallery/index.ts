import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { ProjectGalleryItem } from "@/types/gallery.types";
import type {
  ProjectGalleryRow,
  ProjectGalleryInsert,
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
 * GET /api/admin/projects/[id]/gallery
 * List all gallery items for a project
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

    const result = await typedTable("project_gallery")
      .select("*")
      .eq("project_id", id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: gallery, error } = result as {
      data: ProjectGalleryRow[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching gallery:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ gallery: gallery || [] });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/projects/[id]/gallery
 * Create a new gallery item for a project
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

    const {
      title,
      description,
      media_type = "photo",
      file_url,
      thumbnail_url,
      date,
    } = req.body;

    // Validate required fields
    if (!title || !file_url) {
      return res.status(400).json({
        error: "title and file_url are required",
      });
    }

    // Create gallery item with proper typing
    const galleryData: ProjectGalleryInsert = {
      project_id: id,
      title,
      description: description || null,
      media_type,
      file_url,
      thumbnail_url: thumbnail_url || null,
      date: date || null,
    };

    const result = await typedInsert("project_gallery", galleryData)
      .select()
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating gallery item:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      galleryItem,
      message: "Gallery item created successfully",
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
