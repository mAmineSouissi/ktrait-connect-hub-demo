import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ChantierGalleryUpdate } from "@/types/supabase-database.types";

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
 * PUT /api/admin/chantiers/[id]/gallery/[galleryId]
 * Update a gallery item
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
    const { galleryId } = params;
    const data = await request.json();

    const updateData: ChantierGalleryUpdate = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.media_type !== undefined) updateData.media_type = data.media_type;
    if (data.file_url !== undefined) updateData.file_url = data.file_url;
    if (data.thumbnail_url !== undefined)
      updateData.thumbnail_url = data.thumbnail_url;
    if (data.date !== undefined) updateData.date = data.date;

    const { data: galleryItem, error } = await typedTable("chantier_gallery")
      .update(updateData)
      .eq("id", galleryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ galleryItem });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/chantiers/[id]/gallery/[galleryId]
 * Delete a gallery item
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
    const { galleryId } = params;
    const supabaseAdmin = getSupabaseAdmin();

    // Get gallery item to delete file from storage
    const { data: galleryItem } = await typedTable("chantier_gallery")
      .select("file_url, thumbnail_url")
      .eq("id", galleryId)
      .single();

    // Delete from database
    const { error } = await typedTable("chantier_gallery")
      .delete()
      .eq("id", galleryId);

    if (error) {
      console.error("Error deleting gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Delete file from storage if exists
    if (galleryItem?.file_url) {
      try {
        // Extract file path from URL (format: .../storage/v1/object/public/documents/chantier-gallery/filename)
        const urlParts = galleryItem.file_url.split("/");
        const documentsIndex = urlParts.findIndex(
          (part: string) => part === "documents"
        );
        if (documentsIndex !== -1 && documentsIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(documentsIndex + 1).join("/");
          await supabaseAdmin.storage.from("documents").remove([filePath]);
        }
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue even if storage deletion fails
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
