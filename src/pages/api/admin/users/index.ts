import type { NextApiRequest, NextApiResponse } from "next";
import {
  typedTable,
  typedInsert,
  typedUpdate,
} from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type {
  CreateUserRequest,
  UserListResponse,
  CreateUserResponse,
} from "@/types/user-management.types";
import type {
  UserRow,
  UserInsert,
  ProjectRow,
  ClientRow,
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

    // Check if user has admin role
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
 * GET /api/admin/users
 * List all users (excluding admins) with project counts
 * Query params: search, role, is_active, limit, offset
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  // Check admin access
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const {
    search,
    role,
    is_active,
    limit = "50",
    offset = "0",
    sortKey = "created_at",
    order = "desc",
  } = req.query;

  try {
    // Build query - exclude admins
    let query = typedTable("users")
      .select("*", { count: "exact" })
      .neq("role", "admin");

    // Apply sorting
    const sortField = sortKey as string;
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortField, { ascending });

    // Apply filters
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (is_active !== undefined) {
      query = query.eq("is_active", is_active === "true");
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: users,
      error,
      count,
    } = result as {
      data: UserRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }

    // Transform data to include project counts and client data
    const usersWithCounts = await Promise.all(
      (users || []).map(async (user: UserRow) => {
        // Get project count
        const projectsCountResult = await typedTable("projects")
          .select("*", { count: "exact", head: true })
          .eq("client_id", user.id);
        const { count: projectsCount } = projectsCountResult as {
          count: number | null;
          error: any;
        };

        // Get client-specific data if role is client
        let clientData: Partial<ClientRow> = {};
        if (user.role === "client") {
          const clientResult = await typedTable("clients")
            .select("city, address, postal_code, company_name, tax_id")
            .eq("user_id", user.id)
            .single();
          const { data: client } = clientResult as {
            data: Pick<
              ClientRow,
              "city" | "address" | "postal_code" | "company_name" | "tax_id"
            > | null;
            error: any;
          };

          if (client) {
            clientData = client;
          }
        }

        return {
          ...user,
          projects_count: projectsCount || 0,
          ...clientData,
        };
      })
    );

    const response: UserListResponse = {
      users: usersWithCounts,
      total: count || 0,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/users
 * Create a new user (client or partner, not admin)
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // Check admin access
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const supabase = getSupabaseAdmin();
  const data: CreateUserRequest = req.body;

  // Validation
  if (!data.email || !data.password || !data.full_name || !data.role) {
    return res.status(400).json({
      error: "Missing required fields: email, password, full_name, role",
    });
  }

  // Prevent creating admin users via this endpoint
  if (data.role === "admin") {
    return res
      .status(400)
      .json({ error: "Cannot create admin users via this endpoint" });
  }

  try {
    // Create auth user (using admin client for auth operations)
    const supabase = getSupabaseAdmin();
    const { data: authUser, error: authError } = await (
      (supabase as any).auth.admin as any
    ).createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        phone: data.phone || null,
        role: data.role,
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return res.status(500).json({ error: authError.message });
    }

    if (!authUser.user) {
      return res.status(500).json({ error: "Failed to create auth user" });
    }

    // Wait a bit for the trigger to create the user profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the created user profile
    const userProfileResult = await typedTable("users")
      .select("*")
      .eq("id", authUser.user.id)
      .single();
    const { data: userProfile, error: profileError } = userProfileResult as {
      data: UserRow | null;
      error: any;
    };

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError);
      // Try to clean up auth user
      await (supabase.auth.admin as any).deleteUser(authUser.user.id);
      return res.status(500).json({ error: "Failed to create user profile" });
    }

    // Get current admin user ID for approved_by tracking
    const {
      data: { user: currentAdmin },
    } = await createApiRouteClient(req, res).auth.getUser();
    const adminUserId = currentAdmin?.id;

    // Update user profile with additional data
    const updateData: any = {
      is_active: data.is_active !== undefined ? data.is_active : true,
      // Set approval_status: 'approved' for admins, 'pending' for others
      approval_status: data.role === "admin" ? "approved" : "pending",
    };

    // If admin is creating and approving immediately, set approval fields
    if (data.role !== "admin" && adminUserId) {
      // For now, new users start as 'pending' - admin can approve later
      // If you want auto-approval, change to:
      // updateData.approval_status = "approved";
      // updateData.approved_at = new Date().toISOString();
      // updateData.approved_by = adminUserId;
    }

    if (data.phone) updateData.phone = data.phone;

    const updatedUserResult = await typedUpdate(
      "users",
      updateData as Partial<UserInsert>
    )
      .eq("id", userProfile.id)
      .select()
      .single();
    const { data: updatedUser, error: updateError } = updatedUserResult as {
      data: UserRow | null;
      error: any;
    };

    if (updateError) {
      console.error("Error updating user:", updateError);
    }

    // Create/update client profile if role is client
    // Note: Trigger creates empty client profile, we update it with data
    if (data.role === "client") {
      const clientData: any = {};
      if (data.city !== undefined) clientData.city = data.city || null;
      if (data.address !== undefined) clientData.address = data.address || null;
      if (data.postal_code !== undefined)
        clientData.postal_code = data.postal_code || null;
      if (data.company_name !== undefined)
        clientData.company_name = data.company_name || null;
      if (data.tax_id !== undefined) clientData.tax_id = data.tax_id || null;

      // Check if client profile exists (created by trigger)
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", userProfile.id)
        .single();

      if (existingClient) {
        // Update existing client profile
        const { error: clientError } = await typedUpdate(
          "clients",
          clientData as Partial<ClientRow>
        ).eq("user_id", userProfile.id);

        if (clientError) {
          console.error("Error updating client profile:", clientError);
          // Non-fatal, continue
        }
      } else {
        // Create client profile if trigger didn't create it
        const { error: clientError } = await supabase.from("clients").insert({
          user_id: userProfile.id,
          ...clientData,
        });

        if (clientError) {
          console.error("Error creating client profile:", clientError);
          // Non-fatal, continue
        }
      }
    }

    // Get client data for response
    let clientResponseData: any = {};
    if (data.role === "client") {
      const { data: client } = await supabase
        .from("clients")
        .select("city, address, postal_code, company_name, tax_id")
        .eq("user_id", userProfile.id)
        .single();

      if (client) {
        clientResponseData = client;
      }
    }

    const response: CreateUserResponse = {
      user: {
        ...(updatedUser || userProfile),
        ...clientResponseData,
        projects_count: 0,
      },
      message: "User created successfully",
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.error("Unexpected error creating user:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      return await handleGet(req, res);
    }

    if (req.method === "POST") {
      return await handlePost(req, res);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("API route error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
