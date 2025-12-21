import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/lib/supabase/server";

async function isAdmin(supabase: any) {
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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = await createClient();
  const { id } = req.query;

  const admin = await isAdmin(supabase);
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("clients")
      .select("*, users(full_name, email)")
      .eq("id", id)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const payload = req.body;
    const { data, error } = await supabase
      .from("clients")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
