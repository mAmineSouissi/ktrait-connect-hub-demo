import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
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
 * GET /api/partner/settings/portfolio/projects
 * List all portfolio projects for the current partner
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
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });

    const { data: projects, error } = result as {
      data: any[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partner/settings/portfolio/projects
 * Create a new portfolio project
 */
export async function POST(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, description, category, location, year, image_url, status } =
      body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const insertData: any = {
      partner_id: partnerId,
      name: name.trim(),
      description: description?.trim() || null,
      category: category?.trim() || null,
      location: location?.trim() || null,
      year: year ? parseInt(year) : null,
      image_url: image_url || null,
      status: status || "publié",
    };

    const result = await typedTable("partner_personal_projects")
      .insert(insertData)
      .select()
      .single();

    const { data: project, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error creating project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

