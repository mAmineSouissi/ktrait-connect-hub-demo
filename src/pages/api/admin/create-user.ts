import type { NextApiRequest, NextApiResponse } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const headerKey = (req.headers["x-service-key"] ||
    req.headers["x-service-key"]?.toString()) as string | undefined;
  if (!SERVICE_KEY || headerKey !== SERVICE_KEY) {
    return res.status(401).json({ error: "Invalid or missing service key" });
  }

  if (!SUPABASE_URL)
    return res.status(500).json({ error: "Supabase URL not configured" });

  const supabase = createServiceClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    const { email, password, role, full_name, phone, metadata } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "email, password and role are required" });
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
      return res.status(500).json({ error: createError.message });
    }

    // Wait for trigger to create public.users row then query it
    const { data: userRow, error: userRowError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userRowError || !userRow?.id) {
      return res
        .status(500)
        .json({ error: "Could not find created user in users table" });
    }

    // find role id
    const { data: roleRow, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleRow?.id) {
      return res.status(400).json({ error: "Role not found" });
    }

    // assign role
    const { data: assignment, error: assignError } = await supabase
      .from("user_roles")
      .insert({ user_id: userRow.id, role_id: roleRow.id })
      .select()
      .single();

    if (assignError)
      return res.status(500).json({ error: assignError.message });

    // create client profile if role === client
    if (role === "client") {
      await supabase.from("clients").insert({ user_id: userRow.id }).single();
    }

    return res.status(201).json({ user: userRow, assignment });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
