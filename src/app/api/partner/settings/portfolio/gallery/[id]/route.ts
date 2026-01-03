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
 * PUT /api/partner/settings/portfolio/gallery/[id]
 * Update a gallery item
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

    // Verify item belongs to partner
    const verifyResult = await typedTable("partner_gallery")
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
        { error: "Gallery item not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.image_url !== undefined)
      updateData.image_url = body.image_url.trim();
    if (body.title !== undefined) updateData.title = body.title?.trim() || null;
    if (body.description !== undefined)
      updateData.description = body.description?.trim() || null;
    if (body.order_index !== undefined)
      updateData.order_index = body.order_index;

    updateData.updated_at = new Date().toISOString();

    const result = await typedTable("partner_gallery")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: item, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error updating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partner/settings/portfolio/gallery/[id]
 * Delete a gallery item
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

    // Verify item belongs to partner
    const verifyResult = await typedTable("partner_gallery")
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
        { error: "Gallery item not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("partner_gallery").delete().eq("id", id);

    const { error } = result as {
      error: any;
    };

    if (error) {
      console.error("Error deleting gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

