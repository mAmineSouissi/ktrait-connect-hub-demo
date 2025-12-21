import { NextRequest, NextResponse } from "next/server";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: rolesData, error } = await supabase
      .from("user_roles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id);

    if (error) return false;

    return (rolesData || []).some((r: any) => r?.roles?.name === "admin");
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createAppRouteClient();

  // Check admin
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createAppRouteClient();

  // Check admin
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { user_email, address, city, postal_code, company_name, tax_id } = body;

  if (!user_email) {
    return NextResponse.json(
      { error: "user_email is required" },
      { status: 400 }
    );
  }

  // find user by email
  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("email", user_email)
    .single();
  if (!userData?.id) {
    return NextResponse.json(
      { error: "User not found. Create auth user first." },
      { status: 400 }
    );
  }

  const insert = {
    user_id: userData.id,
    address: address || null,
    city: city || null,
    postal_code: postal_code || null,
    company_name: company_name || null,
    tax_id: tax_id || null,
  };

  const { data, error } = await supabase
    .from("clients")
    .insert(insert)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
