import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectPartnerRow,
  ProjectPartnerInsert,
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
 * GET /api/admin/projects/[id]/partners
 * List all partners for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("project_partners")
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone, address, city, status)
      `
      )
      .eq("project_id", id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    const { data: projectPartners, error } = result as {
      data: (ProjectPartnerRow & { partner: any })[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching project partners:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format partners properly
    const formattedPartners = (projectPartners || []).map((pp) => ({
      id: pp.id,
      project_id: pp.project_id,
      partner_id: pp.partner_id,
      role: pp.role,
      is_primary: pp.is_primary,
      created_at: pp.created_at,
      partner: pp.partner || null,
    }));

    return NextResponse.json({ partners: formattedPartners });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects/[id]/partners
 * Add a partner to a project
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { partner_id, role, is_primary } = body;

    // Validate required fields
    if (!partner_id) {
      return NextResponse.json(
        {
          error: "partner_id is required",
        },
        { status: 400 }
      );
    }

    // Check if partner already exists for this project
    const existingResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", id)
      .eq("partner_id", partner_id)
      .single();

    const { data: existing } = existingResult as {
      data: { id: string } | null;
      error: any;
    };

    if (existing) {
      return NextResponse.json(
        {
          error: "This partner is already assigned to this project",
        },
        { status: 400 }
      );
    }

    // If setting as primary, unset other primary partners
    if (is_primary) {
      await typedTable("project_partners")
        .update({ is_primary: false })
        .eq("project_id", id)
        .eq("is_primary", true);
    }

    // Create project partner relationship
    const partnerData: ProjectPartnerInsert = {
      project_id: id,
      partner_id,
      role: role || null,
      is_primary: is_primary || false,
    };

    const result = await typedInsert("project_partners", partnerData)
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone, address, city, status)
      `
      )
      .single();

    const { data: projectPartner, error } = result as {
      data: (ProjectPartnerRow & { partner: any }) | null;
      error: any;
    };

    if (error) {
      console.error("Error creating project partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        projectPartner: {
          id: projectPartner?.id,
          project_id: projectPartner?.project_id,
          partner_id: projectPartner?.partner_id,
          role: projectPartner?.role,
          is_primary: projectPartner?.is_primary,
          created_at: projectPartner?.created_at,
          partner: projectPartner?.partner || null,
        },
        message: "Partner added to project successfully",
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
