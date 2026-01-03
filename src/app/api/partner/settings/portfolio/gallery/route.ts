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
 * GET /api/partner/settings/portfolio/gallery
 * List all gallery items for the current partner
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
    const result = await typedTable("partner_gallery")
      .select("*")
      .eq("partner_id", partnerId)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const { data: gallery, error } = result as {
      data: any[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching gallery:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ gallery: gallery || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partner/settings/portfolio/gallery
 * Create a new gallery item
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
    const { image_url, title, description, personal_project_id, order_index } =
      body;

    if (!image_url || !image_url.trim()) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // If personal_project_id is provided, verify it belongs to the partner
    if (personal_project_id) {
      const projectResult = await typedTable("partner_personal_projects")
        .select("id")
        .eq("id", personal_project_id)
        .eq("partner_id", partnerId)
        .single();

      const { data: project, error: projectError } = projectResult as {
        data: { id: string } | null;
        error: any;
      };

      if (projectError || !project) {
        return NextResponse.json(
          { error: "Project not found or access denied" },
          { status: 404 }
        );
      }
    }

    const insertData: any = {
      partner_id: partnerId,
      image_url: image_url.trim(),
      title: title?.trim() || null,
      description: description?.trim() || null,
      personal_project_id: personal_project_id || null,
      order_index: order_index || 0,
    };

    const result = await typedTable("partner_gallery")
      .insert(insertData)
      .select()
      .single();

    const { data: item, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error creating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

