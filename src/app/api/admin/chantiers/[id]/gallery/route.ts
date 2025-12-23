import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ChantierGalleryInsert } from "@/types/supabase-database.types";

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    return userData?.role === "admin";
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/admin/chantiers/[id]/gallery
 * Get all gallery items for a chantier
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    const { data: gallery, error } = await typedTable("chantier_gallery")
      .select("*")
      .eq("chantier_id", id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching gallery:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ gallery: gallery || [] });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/chantiers/[id]/gallery
 * Create a new gallery item (file upload handled separately)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    const data = await request.json();

    if (!data.title || !data.file_url) {
      return NextResponse.json(
        { error: "title and file_url are required" },
        { status: 400 }
      );
    }

    const insertData: ChantierGalleryInsert = {
      chantier_id: id,
      title: data.title,
      description: data.description || null,
      media_type: data.media_type || "photo",
      file_url: data.file_url,
      thumbnail_url: data.thumbnail_url || null,
      date: data.date || null,
    };

    const { data: galleryItem, error } = await typedTable("chantier_gallery")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ galleryItem }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
