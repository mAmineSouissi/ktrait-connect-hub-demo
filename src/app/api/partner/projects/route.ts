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
 * GET /api/partner/projects
 * List all projects assigned to the current partner
 * Query params: status, search, limit, offset, sortKey, order
 */
export async function GET(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Get all project_partners entries for this partner with project details
    const projectPartnersQuery = typedTable("project_partners")
      .select(
        `
        *,
        project:projects!project_partners_project_id_fkey(
          id,
          name,
          description,
          status,
          progress,
          estimated_budget,
          spent_amount,
          start_date,
          end_date,
          address,
          category,
          type,
          created_at,
          updated_at,
          client_id,
          client:users!projects_client_id_fkey(
            id,
            full_name,
            email
          )
        )
      `
      )
      .eq("partner_id", partnerId);

    const { data: allProjectPartners, error: queryError } = await projectPartnersQuery;

    if (queryError) {
      console.error("Error fetching partner projects:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    // Filter in JavaScript since we can't filter nested fields directly
    type ProjectPartnerWithProject = ProjectPartnerRow & {
      project: (ProjectRow & {
        client: { id: string; full_name: string; email: string } | null;
      }) | null;
    };

    let filteredProjects = ((allProjectPartners || []) as ProjectPartnerWithProject[])
      .filter((pp: ProjectPartnerWithProject) => pp.project !== null)
      .map((pp: ProjectPartnerWithProject) => ({
        ...pp,
        project: pp.project!,
      }));

    // Apply status filter
    if (status) {
      filteredProjects = filteredProjects.filter(
        (pp) => pp.project.status === status
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter((pp) => {
        const project = pp.project;
        return (
          project.name.toLowerCase().includes(searchLower) ||
          (project.description &&
            project.description.toLowerCase().includes(searchLower)) ||
          (project.client &&
            project.client.full_name.toLowerCase().includes(searchLower))
        );
      });
    }

    // Sort projects
    const ascending = order === "asc" || order === "ASC";
    filteredProjects.sort((a, b) => {
      const aValue = a.project[sortKey as keyof typeof a.project];
      const bValue = b.project[sortKey as keyof typeof b.project];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return ascending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return ascending ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    // Apply pagination
    const total = filteredProjects.length;
    const paginatedProjects = filteredProjects.slice(offset, offset + limit);

    // Format response
    const formattedProjects = paginatedProjects.map((pp) => {
      const project = pp.project;
      return {
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
        client_name: project.client?.full_name || null,
        client_email: project.client?.email || null,
        role: pp.role || null,
        is_primary: pp.is_primary,
        project_partner_id: pp.id,
      };
    });

    return NextResponse.json({
      projects: formattedProjects,
      total: total,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

