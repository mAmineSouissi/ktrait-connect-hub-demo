import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";

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

    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "partner") {
      return null;
    }

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
 * GET /api/partner/settings/portfolio/projects/[id]
 * Get a specific portfolio project
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

    const result = await typedTable("partner_personal_projects")
      .select(
        `
        *,
        gallery:partner_gallery!partner_gallery_personal_project_id_fkey (
          id,
          image_url,
          title,
          description,
          order_index
        )
      `
      )
      .eq("id", id)
      .eq("partner_id", partnerId)
      .single();

    const { data: project, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/partner/settings/portfolio/projects/[id]
 * Update a portfolio project
 */
export async function PUT(
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
    const body = await request.json();

    // Verify project belongs to partner
    const verifyResult = await typedTable("partner_personal_projects")
      .select("id")
      .eq("id", id)
      .eq("partner_id", partnerId)
      .single();

    const { data: verify, error: verifyError } = verifyResult as {
      data: { id: string } | null;
      error: any;
    };

    if (verifyError || !verify) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined)
      updateData.description = body.description?.trim() || null;
    if (body.category !== undefined)
      updateData.category = body.category?.trim() || null;
    if (body.location !== undefined)
      updateData.location = body.location?.trim() || null;
    if (body.year !== undefined)
      updateData.year = body.year ? parseInt(body.year) : null;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.status !== undefined) updateData.status = body.status;

    updateData.updated_at = new Date().toISOString();

    const result = await typedTable("partner_personal_projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: project, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error updating project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partner/settings/portfolio/projects/[id]
 * Delete a portfolio project
 */
export async function DELETE(
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

    // Verify project belongs to partner
    const verifyResult = await typedTable("partner_personal_projects")
      .select("id")
      .eq("id", id)
      .eq("partner_id", partnerId)
      .single();

    const { data: verify, error: verifyError } = verifyResult as {
      data: { id: string } | null;
      error: any;
    };

    if (verifyError || !verify) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("partner_personal_projects")
      .delete()
      .eq("id", id);

    const { error } = result as {
      error: any;
    };

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

