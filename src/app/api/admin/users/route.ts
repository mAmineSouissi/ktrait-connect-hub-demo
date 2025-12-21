import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  CreateUserRequest,
  UserListResponse,
  UserListItem,
  CreateUserResponse,
} from "@/types/user-management.types";
import type {
  UserRow,
  UserInsert,
  ClientRow,
  ClientInsert,
} from "@/types/supabase-database.types";

/**
 * Check if the current user is an admin
 */
async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createAppRouteClient();
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
 * GET /api/admin/users
 * List all users with filters, pagination, and sorting
 * Query params: search, role, is_active, limit, offset, sortKey, order
 */
export async function GET(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const is_active = searchParams.get("is_active");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Build query - exclude admin users
    let query = typedTable("users")
      .select("*", { count: "exact" })
      .neq("role", "admin");

    // Apply search filter
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    // Apply role filter
    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    // Apply is_active filter
    if (is_active !== null && is_active !== undefined && is_active !== "") {
      const isActiveBool = is_active === "true" || is_active === "1";
      query = query.eq("is_active", isActiveBool);
    }

    // Apply sorting
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortKey, { ascending });

    // Apply pagination
    const result = await query.range(offset, offset + limit - 1);

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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get client data for users with client role
    const usersWithClientData = await Promise.all(
      (users || []).map(async (user: UserRow) => {
        let clientData: Partial<ClientRow> = {};
        let projectsCount = 0;

        if (user.role === "client") {
          // Get client profile data
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

          // Get project count
          const projectsCountResult = await typedTable("projects")
            .select("*", { count: "exact", head: true })
            .eq("client_id", user.id);
          const { count } = projectsCountResult as {
            count: number | null;
            error: any;
          };
          projectsCount = count || 0;
        }

        const userListItem: UserListItem = {
          ...user,
          ...clientData,
          projects_count: projectsCount,
        };

        return userListItem;
      })
    );

    const response: UserListResponse = {
      users: usersWithClientData,
      total: count || 0,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user (client or partner, not admin)
 */
export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body: CreateUserRequest = await request.json();
    const {
      email,
      password,
      full_name,
      phone,
      role,
      is_active = true,
      city,
      address,
      postal_code,
      company_name,
      tax_id,
    } = body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "email, password, full_name, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role === "admin") {
      return NextResponse.json(
        { error: "Cannot create admin users via this endpoint" },
        { status: 400 }
      );
    }

    // Create auth user first
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { error: authError?.message || "Failed to create user" },
        { status: 500 }
      );
    }

    // Create user record
    const userInsertData: UserInsert = {
      id: authData.user.id,
      email,
      full_name,
      phone: phone || null,
      role,
      is_active,
      email_verified: true,
    };

    const userResult = await typedInsert("users", userInsertData)
      .select()
      .single();
    const { data: user, error: userError } = userResult as {
      data: UserRow | null;
      error: any;
    };

    if (userError || !user) {
      // Rollback: delete auth user if user creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("Error creating user record:", userError);
      return NextResponse.json(
        { error: userError?.message || "Failed to create user record" },
        { status: 500 }
      );
    }

    // Create client profile if role is client
    let clientData: Partial<ClientRow> = {};
    if (
      role === "client" &&
      (city || address || postal_code || company_name || tax_id)
    ) {
      const clientInsertData: ClientInsert = {
        user_id: user.id,
        city: city || null,
        address: address || null,
        postal_code: postal_code || null,
        company_name: company_name || null,
        tax_id: tax_id || null,
      };

      const clientResult = await typedInsert("clients", clientInsertData)
        .select()
        .single();
      const { data: client } = clientResult as {
        data: ClientRow | null;
        error: any;
      };

      if (client) {
        clientData = {
          city: client.city,
          address: client.address,
          postal_code: client.postal_code,
          company_name: client.company_name,
          tax_id: client.tax_id,
        };
      }
    }

    const response: CreateUserResponse = {
      user: {
        ...user,
        ...clientData,
        projects_count: 0,
      } as any,
      message: "User created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
