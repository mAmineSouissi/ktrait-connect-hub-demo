import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ProjectRow } from "@/types/supabase-database.types";
import type { ProjectPartnerRow } from "@/types/supabase-database.types";

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
 * GET /api/partner/projects/[id]
 * Get project details (only if assigned to current partner)
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
    const projectPartnerResult = await typedTable("project_partners")
      .select(
        `
        *,
        project:projects!project_partners_project_id_fkey(
          *,
          client:users!projects_client_id_fkey(
            id,
            full_name,
            email,
            phone
          )
        )
      `
      )
      .eq("project_id", id)
      .eq("partner_id", partnerId)
      .single();

    const { data: projectPartner, error: projectPartnerError } =
      projectPartnerResult as {
        data: (ProjectPartnerRow & {
          project: ProjectRow & {
            client: {
              id: string;
              full_name: string;
              email: string;
              phone?: string | null;
            } | null;
          } | null;
        }) | null;
        error: any;
      };

    if (projectPartnerError || !projectPartner || !projectPartner.project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const project = projectPartner.project;

    // Get additional project data
    const projectData = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      estimated_budget: project.estimated_budget,
      spent_amount: project.spent_amount,
      start_date: project.start_date,
      end_date: project.end_date,
      address: project.address,
      category: project.category,
      type: project.type,
      created_at: project.created_at,
      updated_at: project.updated_at,
      client_id: project.client_id,
      client: project.client
        ? {
            id: project.client.id,
            full_name: project.client.full_name,
            email: project.client.email,
            phone: project.client.phone || null,
          }
        : null,
      role: projectPartner.role || null,
      is_primary: projectPartner.is_primary,
      project_partner_id: projectPartner.id,
    };

    return NextResponse.json({ project: projectData });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

