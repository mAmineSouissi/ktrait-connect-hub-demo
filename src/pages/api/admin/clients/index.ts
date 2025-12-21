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

  // Check admin
  const admin = await isAdmin(supabase);
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("clients")
      .select("*, users(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { user_email, address, city, postal_code, company_name, tax_id } =
      req.body;

    if (!user_email)
      return res.status(400).json({ error: "user_email is required" });

    // find user by email
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", user_email)
      .single();
    if (!userData?.id)
      return res
        .status(400)
        .json({ error: "User not found. Create auth user first." });

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
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
