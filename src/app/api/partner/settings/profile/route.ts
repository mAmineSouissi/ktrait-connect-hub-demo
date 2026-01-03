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
 * GET /api/partner/settings/profile
 * Get partner profile information
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
    // Get partner profile with user info
    const profileResult = await typedTable("partners_profile")
      .select(
        `
        *,
        partner:partners!partners_profile_partner_id_fkey (
          id,
          name,
          type,
          email,
          phone,
          address,
          city,
          postal_code,
          status
        ),
        user:users!partners_profile_user_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .eq("partner_id", partnerId)
      .single();

    const { data: profile, error } = profileResult as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/partner/settings/profile
 * Update partner profile information
 */
export async function PUT(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updateData: any = {};

    // Update partners_profile fields
    if (body.siret !== undefined) updateData.siret = body.siret;
    if (body.company_name !== undefined)
      updateData.company_name = body.company_name;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.bio !== undefined) updateData.bio = body.bio;

    // Update partners table fields
    const partnerUpdateData: any = {};
    if (body.name !== undefined) partnerUpdateData.name = body.name;
    if (body.email !== undefined) partnerUpdateData.email = body.email;
    if (body.phone !== undefined) partnerUpdateData.phone = body.phone;
    if (body.address !== undefined) partnerUpdateData.address = body.address;
    if (body.city !== undefined) partnerUpdateData.city = body.city;
    if (body.postal_code !== undefined)
      partnerUpdateData.postal_code = body.postal_code;

    // Update user fields
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const userUpdateData: any = {};
      if (body.full_name !== undefined) userUpdateData.full_name = body.full_name;
      if (body.user_phone !== undefined) userUpdateData.phone = body.user_phone;
      if (body.avatar_url !== undefined)
        userUpdateData.avatar_url = body.avatar_url;

      if (Object.keys(userUpdateData).length > 0) {
        await supabase
          .from("users")
          .update(userUpdateData)
          .eq("id", user.id);
      }
    }

    // Update partners_profile
    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString();
      const profileUpdateResult = await typedTable("partners_profile")
        .update(updateData)
        .eq("partner_id", partnerId)
        .select()
        .single();

      const { error: profileError } = profileUpdateResult as {
        data: any;
        error: any;
      };

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return NextResponse.json(
          { error: profileError.message },
          { status: 500 }
        );
      }
    }

    // Update partners table
    if (Object.keys(partnerUpdateData).length > 0) {
      partnerUpdateData.updated_at = new Date().toISOString();
      const partnerUpdateResult = await typedTable("partners")
        .update(partnerUpdateData)
        .eq("id", partnerId)
        .select()
        .single();

      const { error: partnerError } = partnerUpdateResult as {
        data: any;
        error: any;
      };

      if (partnerError) {
        console.error("Error updating partner:", partnerError);
        return NextResponse.json(
          { error: partnerError.message },
          { status: 500 }
        );
      }
    }

    // Fetch updated profile
    const profileResult = await typedTable("partners_profile")
      .select(
        `
        *,
        partner:partners!partners_profile_partner_id_fkey (
          id,
          name,
          type,
          email,
          phone,
          address,
          city,
          postal_code,
          status
        ),
        user:users!partners_profile_user_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .eq("partner_id", partnerId)
      .single();

    const { data: profile, error: fetchError } = profileResult as {
      data: any;
      error: any;
    };

    if (fetchError) {
      console.error("Error fetching updated profile:", fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

