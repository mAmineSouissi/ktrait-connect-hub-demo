import { NextRequest, NextResponse } from "next/server";
import {
  typedTable,
  typedInsert,
  typedUpdate,
} from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  PartnerRow,
  PartnerInsert,
  PartnerUpdate,
  UserRow,
  UserInsert,
  PartnerProfileInsert,
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
 * GET /api/admin/partners
 * List all partners with filters
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
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    let query = typedTable("partners").select("*", { count: "exact" });

    // Apply sorting
    const sortField = sortKey as string;
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortField, { ascending });

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (type) {
      query = query.eq("type", type as string);
    }

    if (status) {
      query = query.eq("status", status as string);
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: partners,
      error,
      count,
    } = result as {
      data: PartnerRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching partners:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get project counts for each partner
    const partnersWithCounts = await Promise.all(
      (partners || []).map(async (partner) => {
        const projectCountResult = await typedTable("project_partners")
          .select("*", { count: "exact", head: true })
          .eq("partner_id", partner.id);

        const { count: projectCount } = projectCountResult as {
          count: number | null;
          error: any;
        };

        return {
          ...partner,
          projects_count: projectCount || 0,
        };
      })
    );

    return NextResponse.json({
      partners: partnersWithCounts,
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/partners
 * Create a new partner (creates user account first, then partner record)
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
    const body = await request.json();
    const {
      // User account fields
      email,
      password,
      full_name,
      phone: userPhone,
      // Partner fields
      name,
      type,
      contact_person,
      phone,
      address,
      city,
      postal_code,
      status = "Actif",
      since_date,
      notes,
    } = body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return NextResponse.json(
        {
          error: "email, password, and full_name are required",
        },
        { status: 400 }
      );
    }

    if (!name || !type) {
      return NextResponse.json(
        {
          error: "name and type are required",
        },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUserResult = await typedTable("users")
      .select("id")
      .eq("email", email)
      .single();

    const { data: existingUser } = existingUserResult as {
      data: { id: string } | null;
      error: any;
    };

    if (existingUser) {
      return NextResponse.json(
        {
          error: "A user with this email already exists",
        },
        { status: 400 }
      );
    }

    // Create auth user first
    const { data: authUser, error: authError } = await (
      (supabaseAdmin as any).auth.admin as any
    ).createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone: userPhone || phone || null,
        role: "partner",
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    if (!authUser.user) {
      return NextResponse.json(
        { error: "Failed to create auth user" },
        { status: 500 }
      );
    }

    // Wait for trigger to create user profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the created user profile
    const userProfileResult = await typedTable("users")
      .select("*")
      .eq("id", authUser.user.id)
      .single();

    const { data: userProfile, error: profileError } = userProfileResult as {
      data: any;
      error: any;
    };

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError);
      // Try to clean up auth user
      await (supabaseAdmin.auth.admin as any).deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // Update user profile with phone if provided
    if (userPhone || phone) {
      await typedUpdate("users", {
        phone: userPhone || phone || null,
      }).eq("id", userProfile.id);
    }

    // Create partner record
    const partnerData: PartnerInsert = {
      name,
      type,
      contact_person: contact_person || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      postal_code: postal_code || null,
      status: status || "Actif",
      since_date: since_date || null,
      notes: notes || null,
    };

    const partnerResult = await typedInsert("partners", partnerData)
      .select("*")
      .single();

    const { data: partner, error: partnerError } = partnerResult as {
      data: PartnerRow | null;
      error: any;
    };

    if (partnerError || !partner) {
      console.error("Error creating partner:", partnerError);
      // Clean up auth user if partner creation fails
      await (supabaseAdmin.auth.admin as any).deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: partnerError?.message || "Failed to create partner" },
        { status: 500 }
      );
    }

    // Create partners_profile to link user and partner
    const profileData: PartnerProfileInsert = {
      user_id: userProfile.id,
      partner_id: partner.id,
      company_name: name,
    };

    const { error: profileLinkError } = await typedInsert(
      "partners_profile",
      profileData
    );

    if (profileLinkError) {
      console.error("Error creating partner profile link:", profileLinkError);
      // Non-fatal, continue
    }

    return NextResponse.json(
      {
        partner: {
          ...partner,
          user_id: userProfile.id,
          user: {
            id: userProfile.id,
            email: userProfile.email,
            full_name: userProfile.full_name,
            phone: userProfile.phone,
          },
        },
        message: "Partner created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
