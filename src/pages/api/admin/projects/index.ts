import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { Project, ProjectWithDetails } from "@/types/project.types";
import type {
  ProjectRow,
  ProjectInsert,
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
 * GET /api/admin/projects
 * List all projects with filters and pagination
 * Query params: search, client_id, status, limit, offset
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const {
      search,
      client_id,
      status,
      limit = "100",
      offset = "0",
      sortKey = "created_at",
      order = "desc",
    } = req.query;

    // Get projects first
    let query = (supabaseAdmin.from("projects") as any).select("*", {
      count: "exact",
    });

    // Apply sorting
    const sortField = sortKey as string;
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortField, { ascending });

    query = query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (client_id) {
      query = query.eq("client_id", client_id as string);
    }
    if (status) {
      query = query.eq("status", status as string);
    }

    const { data: projects, error, count } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ error: error.message });
    }

    // Get client info for each project
    const projectsWithClients = await Promise.all(
      (projects || []).map(async (project: ProjectRow) => {
        const clientResult = await typedTable("users")
          .select("id, full_name, email, phone")
          .eq("id", project.client_id)
          .single();
        const { data: client } = clientResult as {
          data: {
            id: string;
            full_name: string;
            email: string;
            phone?: string | null;
          } | null;
          error: any;
        };

        return {
          ...project,
          client: client || null,
        };
      })
    );

    return res.status(200).json({
      projects: projectsWithClients,
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/projects
 * Create a new project
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
      name,
      description,
      status = "planifié",
      estimated_budget,
      start_date,
      end_date,
      address,
    } = req.body;

    // Validate required fields
    if (!client_id || !name) {
      return res.status(400).json({
        error: "client_id and name are required",
      });
    }

    // Verify client exists
    const { data: clientExists } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", client_id)
      .single();

    if (!clientExists) {
      return res.status(400).json({ error: "Client not found" });
    }

    // Create project with proper typing
    const projectData: ProjectInsert = {
      client_id,
      name,
      description,
      status,
      estimated_budget: estimated_budget ? parseFloat(estimated_budget) : null,
      start_date: start_date || null,
      end_date: end_date || null,
      address: address || null,
      progress: 0,
      spent_amount: 0,
    };

    const result = await typedInsert("projects", projectData)
      .select("*")
      .single();

    const { data: project, error } = result as {
      data: ProjectRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      project,
      message: "Project created successfully",
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
