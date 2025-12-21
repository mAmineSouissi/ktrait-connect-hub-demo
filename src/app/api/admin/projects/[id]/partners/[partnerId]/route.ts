import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectPartnerRow,
  ProjectPartnerUpdate,
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
 * PUT /api/admin/projects/[id]/partners/[partnerId]
 * Update project partner relationship
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; partnerId: string } }
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
    const { partnerId } = params;

    if (!partnerId) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, is_primary } = body;

    // Build update object with proper typing
    const updateData: ProjectPartnerUpdate = {};
    if (role !== undefined) updateData.role = role || null;
    if (is_primary !== undefined) {
      updateData.is_primary = is_primary;

      // If setting as primary, unset other primary partners for this project
      if (is_primary) {
        const currentResult = await typedTable("project_partners")
          .select("project_id")
          .eq("id", partnerId)
          .single();

        const { data: current } = currentResult as {
          data: { project_id: string } | null;
          error: any;
        };

        if (current) {
          await typedTable("project_partners")
            .update({ is_primary: false })
            .eq("project_id", current.project_id)
            .eq("is_primary", true)
            .neq("id", partnerId);
        }
      }
    }

    const result = await typedUpdate("project_partners", updateData)
      .eq("id", partnerId)
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
      console.error("Error updating project partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      projectPartner: {
        id: projectPartner?.id,
        project_id: projectPartner?.project_id,
        partner_id: projectPartner?.partner_id,
        role: projectPartner?.role,
        is_primary: projectPartner?.is_primary,
        created_at: projectPartner?.created_at,
        partner: projectPartner?.partner || null,
      },
      message: "Project partner updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]/partners/[partnerId]
 * Remove partner from project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; partnerId: string } }
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
    const { partnerId } = params;

    if (!partnerId) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const { error } = await typedTable("project_partners")
      .delete()
      .eq("id", partnerId);

    if (error) {
      console.error("Error deleting project partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Partner removed from project successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
