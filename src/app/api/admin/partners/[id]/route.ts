import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  PartnerRow,
  PartnerUpdate,
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
 * GET /api/admin/partners/[id]
 * Get partner details with all related data
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
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    // Get partner
    const result = await typedTable("partners")
      .select("*")
      .eq("id", id)
      .single();

    const { data: partner, error } = result as {
      data: PartnerRow | null;
      error: any;
    };

    if (error || !partner) {
      console.error("Error fetching partner:", error);
      return NextResponse.json(
        {
          error: "Partner not found",
          details: error?.message,
        },
        { status: 404 }
      );
    }

    // Get user info if partner has a user account
    let userInfo = null;
    const profileResult = await typedTable("partners_profile")
      .select("user_id")
      .eq("partner_id", id)
      .single();

    const { data: profile } = profileResult as {
      data: { user_id: string } | null;
      error: any;
    };

    if (profile?.user_id) {
      const userResult = await typedTable("users")
        .select("id, full_name, email, phone")
        .eq("id", profile.user_id)
        .single();

      const { data: userData } = userResult as {
        data: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
        } | null;
        error: any;
      };

      if (userData) {
        userInfo = {
          id: userData.id,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone || null,
        };
      }
    }

    // Get projects where this partner is assigned
    const projectsResult = await typedTable("project_partners")
      .select(
        `
        *,
        project:projects(
          id,
          name,
          status,
          client:users!projects_client_id_fkey(id, full_name)
        )
      `
      )
      .eq("partner_id", id);

    const { data: projectPartners } = projectsResult as {
      data: any[] | null;
      error: any;
    };

    const projects = (projectPartners || []).map((pp: any) => ({
      id: pp.project?.id || "",
      name: pp.project?.name || "",
      status: pp.project?.status || "",
      client_name: pp.project?.client?.full_name || "",
      role: pp.role || null,
      is_primary: pp.is_primary || false,
    }));

    // Get documents count
    const docsCountResult = await typedTable("documents")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", id);

    const { count: documentsCount } = docsCountResult as {
      count: number | null;
      error: any;
    };

    // Get certifications
    const certificationsResult = await typedTable("partner_certifications")
      .select("*")
      .eq("partner_id", id)
      .order("issue_date", { ascending: false });

    const { data: certifications } = certificationsResult as {
      data: any[] | null;
      error: any;
    };

    // Get personal projects (portfolio)
    const personalProjectsResult = await typedTable("partner_personal_projects")
      .select("*")
      .eq("partner_id", id)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: personalProjects } = personalProjectsResult as {
      data: any[] | null;
      error: any;
    };

    // Get gallery items
    const galleryResult = await typedTable("partner_gallery")
      .select("*")
      .eq("partner_id", id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const { data: gallery } = galleryResult as {
      data: any[] | null;
      error: any;
    };

    const partnerWithDetails = {
      ...partner,
      user: userInfo,
      projects: projects || [],
      projects_count: projects.length,
      documents_count: documentsCount || 0,
      certifications: certifications || [],
      personal_projects: personalProjects || [],
      gallery: gallery || [],
    };

    return NextResponse.json({
      partner: partnerWithDetails,
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
 * PUT /api/admin/partners/[id]
 * Update partner
 */
export async function PUT(
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
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      type,
      contact_person,
      email,
      phone,
      address,
      city,
      postal_code,
      status,
      since_date,
      notes,
    } = body;

    // Build update object
    const updateData: PartnerUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (contact_person !== undefined)
      updateData.contact_person = contact_person || null;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address !== undefined) updateData.address = address || null;
    if (city !== undefined) updateData.city = city || null;
    if (postal_code !== undefined) updateData.postal_code = postal_code || null;
    if (status !== undefined) updateData.status = status;
    if (since_date !== undefined) updateData.since_date = since_date || null;
    if (notes !== undefined) updateData.notes = notes || null;

    const result = await typedUpdate("partners", updateData)
      .eq("id", id)
      .select("*")
      .single();

    const { data: partner, error } = result as {
      data: PartnerRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      partner,
      message: "Partner updated successfully",
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
 * DELETE /api/admin/partners/[id]
 * Delete partner
 */
export async function DELETE(
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
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const { error } = await typedTable("partners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Partner deleted successfully",
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
