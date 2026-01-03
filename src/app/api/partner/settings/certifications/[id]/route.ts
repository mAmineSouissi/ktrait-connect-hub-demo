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
 * PUT /api/partner/settings/certifications/[id]
 * Update a certification
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

    // Verify certification belongs to partner
    const verifyResult = await typedTable("partner_certifications")
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
        { error: "Certification not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.number !== undefined)
      updateData.number = body.number?.trim() || null;
    if (body.issuing_organization !== undefined)
      updateData.issuing_organization = body.issuing_organization?.trim() || null;
    if (body.issue_date !== undefined) updateData.issue_date = body.issue_date;
    if (body.expiry_date !== undefined)
      updateData.expiry_date = body.expiry_date;
    if (body.certificate_url !== undefined)
      updateData.certificate_url = body.certificate_url;
    if (body.status !== undefined) updateData.status = body.status;

    updateData.updated_at = new Date().toISOString();

    const result = await typedTable("partner_certifications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: certification, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error updating certification:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ certification });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partner/settings/certifications/[id]
 * Delete a certification
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

    // Verify certification belongs to partner
    const verifyResult = await typedTable("partner_certifications")
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
        { error: "Certification not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("partner_certifications")
      .delete()
      .eq("id", id);

    const { error } = result as {
      error: any;
    };

    if (error) {
      console.error("Error deleting certification:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Certification deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

