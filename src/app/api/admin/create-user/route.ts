import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(request: NextRequest) {
  const headerKey = request.headers.get("x-service-key");
  if (!SERVICE_KEY || headerKey !== SERVICE_KEY) {
    return NextResponse.json(
      { error: "Invalid or missing service key" },
      { status: 401 }
    );
  }

  if (!SUPABASE_URL) {
    return NextResponse.json(
      { error: "Supabase URL not configured" },
      { status: 500 }
    );
  }

  const supabase = createServiceClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    const body = await request.json();
    const { email, password, role, full_name, phone, metadata } = body;
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "email, password and role are required" },
        { status: 400 }
      );
    }

    // Create auth user using service role
    const { data: createdUserData, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: full_name || email,
          phone: phone || null,
          ...(metadata || {}),
        },
        email_confirm: true,
      } as any);

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // Wait for trigger to create public.users row then query it
    const { data: userRow, error: userRowError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userRowError || !userRow?.id) {
      return NextResponse.json(
        { error: "Could not find created user in users table" },
        { status: 500 }
      );
    }

    // find role id
    const { data: roleRow, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleRow?.id) {
      return NextResponse.json({ error: "Role not found" }, { status: 400 });
    }

    // assign role
    const { data: assignment, error: assignError } = await supabase
      .from("user_roles")
      .insert({ user_id: userRow.id, role_id: roleRow.id })
      .select()
      .single();

    if (assignError) {
      return NextResponse.json({ error: assignError.message }, { status: 500 });
    }

    // create client profile if role === client
    if (role === "client") {
      await supabase.from("clients").insert({ user_id: userRow.id }).single();
    }

    return NextResponse.json({ user: userRow, assignment }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
