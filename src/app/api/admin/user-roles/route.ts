import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Helper: allow using service role key via header for bootstrapping
function getServiceClientIfProvided(request: NextRequest) {
  const headerKey = request.headers.get("x-service-key");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (
    serviceKey &&
    headerKey === serviceKey &&
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey
    );
  }
  return null;
}

async function isAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: rolesData } = await supabase
    .from("user_roles")
    .select("role_id, roles(name)")
    .eq("user_id", user.id);
  return (rolesData || []).some((r: any) => r?.roles?.name === "admin");
}

export async function GET(request: NextRequest) {
  // if service key provided match, use service client with elevated privileges
  const serviceClient = getServiceClientIfProvided(request);
  const supabase = serviceClient ?? (await createClient());

  // if not using serviceClient, enforce admin check
  if (!serviceClient) {
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("*, roles(name, description), users(id, email, full_name)");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  // if service key provided match, use service client with elevated privileges
  const serviceClient = getServiceClientIfProvided(request);
  const supabase = serviceClient ?? (await createClient());

  // if not using serviceClient, enforce admin check
  if (!serviceClient) {
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await request.json();
  const { user_id, role_name } = body;
  if (!user_id || !role_name) {
    return NextResponse.json(
      { error: "user_id and role_name are required" },
      { status: 400 }
    );
  }

  // find role id
  const { data: roleRow, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", role_name)
    .single();
  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }
  if (!roleRow?.id) {
    return NextResponse.json({ error: "Role not found" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_roles")
    .insert({ user_id, role_id: roleRow.id })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  // if service key provided match, use service client with elevated privileges
  const serviceClient = getServiceClientIfProvided(request);
  const supabase = serviceClient ?? (await createClient());

  // if not using serviceClient, enforce admin check
  if (!serviceClient) {
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await request.json();
  const { user_id, role_name } = body;
  if (!user_id || !role_name) {
    return NextResponse.json(
      { error: "user_id and role_name are required" },
      { status: 400 }
    );
  }

  // find role id
  const { data: roleRow, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", role_name)
    .single();
  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }
  if (!roleRow?.id) {
    return NextResponse.json({ error: "Role not found" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", user_id)
    .eq("role_id", roleRow.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
