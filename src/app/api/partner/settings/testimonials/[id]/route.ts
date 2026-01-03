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
 * PUT /api/partner/settings/testimonials/[id]
 * Update a testimonial
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

    // Verify testimonial belongs to partner
    const verifyResult = await typedTable("partner_testimonials")
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
        { error: "Testimonial not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.client_name !== undefined)
      updateData.client_name = body.client_name.trim();
    if (body.project_name !== undefined)
      updateData.project_name = body.project_name.trim();
    if (body.text !== undefined) updateData.text = body.text.trim();
    if (body.rating !== undefined)
      updateData.rating =
        body.rating >= 1 && body.rating <= 5 ? body.rating : 5;
    if (body.date !== undefined) updateData.date = body.date;

    updateData.updated_at = new Date().toISOString();

    const result = await typedTable("partner_testimonials")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: testimonial, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error updating testimonial:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partner/settings/testimonials/[id]
 * Delete a testimonial
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

    // Verify testimonial belongs to partner
    const verifyResult = await typedTable("partner_testimonials")
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
        { error: "Testimonial not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("partner_testimonials")
      .delete()
      .eq("id", id);

    const { error } = result as {
      error: any;
    };

    if (error) {
      console.error("Error deleting testimonial:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

