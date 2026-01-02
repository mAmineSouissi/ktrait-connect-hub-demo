import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectPhaseRow } from "@/types/supabase-database.types";

/**
 * Get current partner ID from authenticated user
 */
async function getCurrentPartnerId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "partner") {
      return null;
    }

    // Get partner_id from partners_profile
    const profileResult = await typedTable("partners_profile")
      .select("partner_id")
      .eq("user_id", user.id)
      .single();

    const { data: profile } = profileResult as {
      data: { partner_id: string } | null;
      error: any;
    };

    return profile?.partner_id || null;
  } catch (error) {
    console.error("Error checking partner:", error);
    return null;
  }
}

/**
 * Verify partner is assigned to project
 */
async function verifyPartnerAccess(
  partnerId: string,
  projectId: string
): Promise<boolean> {
  try {
    const projectPartnerResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", projectId)
      .eq("partner_id", partnerId)
      .single();

    const { data: projectPartner } = projectPartnerResult as {
      data: { id: string } | null;
      error: any;
    };

    return !!projectPartner;
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/partner/projects/[id]/phases
 * List all phases for a project (read-only, only if partner is assigned)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify partner is assigned to this project
    const hasAccess = await verifyPartnerAccess(partnerId, id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch phases for this project
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ phases: phases || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

