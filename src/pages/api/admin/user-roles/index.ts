import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Helper: allow using service role key via header for bootstrapping
function getServiceClientIfProvided(req: NextApiRequest) {
  const headerKey = req.headers["x-service-key"] as string | undefined;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if service key provided match, use service client with elevated privileges
  const serviceClient = getServiceClientIfProvided(req);
  const supabase = serviceClient ?? (await createClient());

  // if not using serviceClient, enforce admin check
  if (!serviceClient) {
    const admin = await isAdmin(supabase);
    if (!admin) return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*, roles(name, description), users(id, email, full_name)");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { user_id, role_name } = req.body;
    if (!user_id || !role_name)
      return res
        .status(400)
        .json({ error: "user_id and role_name are required" });

    // find role id
    const { data: roleRow, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role_name)
      .single();
    if (roleError) return res.status(500).json({ error: roleError.message });
    if (!roleRow?.id) return res.status(400).json({ error: "Role not found" });

    const { data, error } = await supabase
      .from("user_roles")
      .insert({ user_id, role_id: roleRow.id })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "DELETE") {
    const { user_id, role_name } = req.body;
    if (!user_id || !role_name)
      return res
        .status(400)
        .json({ error: "user_id and role_name are required" });

    // find role id
    const { data: roleRow, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role_name)
      .single();
    if (roleError) return res.status(500).json({ error: roleError.message });
    if (!roleRow?.id) return res.status(400).json({ error: "Role not found" });

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id)
      .eq("role_id", roleRow.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
