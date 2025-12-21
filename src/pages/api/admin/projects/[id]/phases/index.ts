import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { ProjectPhase } from "@/types/project.types";
import type {
  ProjectPhaseRow,
  ProjectPhaseInsert,
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
 * GET /api/admin/projects/[id]/phases
 * List all phases for a project
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

    const result = await typedTable("project_phases")
      .select("*")
      .eq("project_id", id)
      .order("order_index", { ascending: true });

    const { data: phases, error } = result as {
      data: ProjectPhaseRow[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching phases:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ phases: phases || [] });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/projects/[id]/phases
 * Create a new phase for a project
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
      name,
      description,
      status = "à_venir",
      progress_percentage = 0,
      order_index,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: "name is required",
      });
    }

    // Get current max order_index if not provided
    let finalOrderIndex = order_index;
    if (finalOrderIndex === undefined) {
      const existingPhasesResult = await typedTable("project_phases")
        .select("order_index")
        .eq("project_id", id)
        .order("order_index", { ascending: false })
        .limit(1);
      const { data: existingPhases } = existingPhasesResult as {
        data: { order_index: number }[] | null;
        error: any;
      };

      finalOrderIndex =
        existingPhases && existingPhases.length > 0
          ? (existingPhases[0].order_index || 0) + 1
          : 0;
    }

    // Create phase with proper typing
    const phaseData: ProjectPhaseInsert = {
      project_id: id,
      name,
      description: description || null,
      status,
      progress_percentage: Math.max(0, Math.min(100, progress_percentage)),
      order_index: finalOrderIndex,
    };

    const result = await typedInsert("project_phases", phaseData)
      .select()
      .single();

    const { data: phase, error } = result as {
      data: ProjectPhaseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating phase:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      phase,
      message: "Phase created successfully",
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
