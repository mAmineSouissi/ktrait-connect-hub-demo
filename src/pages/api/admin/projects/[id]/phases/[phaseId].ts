import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { ProjectPhase } from "@/types/project.types";
import type {
  ProjectPhaseRow,
  ProjectPhaseUpdate,
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
 * GET /api/admin/projects/[id]/phases/[phaseId]
 * Get phase by ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { phaseId } = req.query;

    if (!phaseId || typeof phaseId !== "string") {
      return res.status(400).json({ error: "Phase ID is required" });
    }

    const result = await typedTable("project_phases")
      .select("*")
      .eq("id", phaseId)
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching phase:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    return res.status(200).json({ phase });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/projects/[id]/phases/[phaseId]
 * Update phase
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { phaseId } = req.query;

    if (!phaseId || typeof phaseId !== "string") {
      return res.status(400).json({ error: "Phase ID is required" });
    }

    const {
      name,
      description,
      status,
      progress_percentage,
      order_index,
      started_at,
      completed_at,
    } = req.body;

    // Build update object with proper typing
    const updateData: ProjectPhaseUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (progress_percentage !== undefined)
      updateData.progress_percentage = Math.max(
        0,
        Math.min(100, progress_percentage)
      );
    if (order_index !== undefined) updateData.order_index = order_index;
    if (started_at !== undefined) updateData.started_at = started_at || null;
    if (completed_at !== undefined)
      updateData.completed_at = completed_at || null;

    const result = await typedUpdate("project_phases", updateData)
      .eq("id", phaseId)
      .select()
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating phase:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      phase,
      message: "Phase updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/projects/[id]/phases/[phaseId]
 * Delete phase
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { phaseId } = req.query;

    if (!phaseId || typeof phaseId !== "string") {
      return res.status(400).json({ error: "Phase ID is required" });
    }

    const { error } = await typedTable("project_phases")
      .delete()
      .eq("id", phaseId);

    if (error) {
      console.error("Error deleting phase:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Phase deleted successfully",
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
