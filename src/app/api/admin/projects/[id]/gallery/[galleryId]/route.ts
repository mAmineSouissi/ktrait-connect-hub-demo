import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectGalleryRow,
  ProjectGalleryUpdate,
} from "@/types/supabase-database.types";

/**
 * Check if the current user is an admin
 */
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
    console.error("Error checking admin:", error);
    return false;
  }
}

/**
 * GET /api/admin/projects/[id]/gallery/[galleryId]
 * Get gallery item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = params;

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("project_gallery")
      .select("*")
      .eq("id", galleryId)
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ galleryItem });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]/gallery/[galleryId]
 * Update gallery item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = params;

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, media_type, file_url, thumbnail_url, date } =
      body;

    // Build update object with proper typing
    const updateData: ProjectGalleryUpdate = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (media_type !== undefined) updateData.media_type = media_type;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (date !== undefined) updateData.date = date || null;

    const result = await typedUpdate("project_gallery", updateData)
      .eq("id", galleryId)
      .select()
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      galleryItem,
      message: "Gallery item updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]/gallery/[galleryId]
 * Delete gallery item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { galleryId } = params;

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const { error } = await typedTable("project_gallery")
      .delete()
      .eq("id", galleryId);

    if (error) {
      console.error("Error deleting gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Gallery item deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
