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
 * GET /api/partner/settings/certifications
 * List all certifications for the current partner
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
    const result = await typedTable("partner_certifications")
      .select("*")
      .eq("partner_id", partnerId)
      .order("issue_date", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: certifications, error } = result as {
      data: any[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching certifications:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ certifications: certifications || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partner/settings/certifications
 * Create a new certification
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
    const {
      name,
      number,
      issuing_organization,
      issue_date,
      expiry_date,
      certificate_url,
      status,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Certification name is required" },
        { status: 400 }
      );
    }

    const insertData: any = {
      partner_id: partnerId,
      name: name.trim(),
      number: number?.trim() || null,
      issuing_organization: issuing_organization?.trim() || null,
      issue_date: issue_date || null,
      expiry_date: expiry_date || null,
      certificate_url: certificate_url || null,
      status: status || "Valide",
    };

    const result = await typedTable("partner_certifications")
      .insert(insertData)
      .select()
      .single();

    const { data: certification, error } = result as {
      data: any;
      error: any;
    };

    if (error) {
      console.error("Error creating certification:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ certification }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

