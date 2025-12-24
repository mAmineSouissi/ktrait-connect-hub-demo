import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectGalleryRow,
  ProjectGalleryUpdate,
} from "@/types/supabase-database.types";

/**
 * Check if the current user is a client and get their ID
 */
async function getCurrentClientId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "client") {
      return userData.id;
    }

    return null;
  } catch (error) {
    console.error("Error checking client:", error);
    return null;
  }
}

/**
 * Verify gallery item belongs to client's project
 */
async function verifyGalleryOwnership(
  galleryId: string,
  projectId: string,
  clientId: string
): Promise<boolean> {
  const galleryResult = await typedTable("project_gallery")
    .select("project_id, project:projects!project_gallery_project_id_fkey(client_id)")
    .eq("id", galleryId)
    .eq("project_id", projectId)
    .single();

  const { data: gallery } = galleryResult as {
    data: { project_id: string; project?: { client_id: string } } | null;
    error: any;
  };

  if (!gallery || !gallery.project) {
    return false;
  }

  return gallery.project.client_id === clientId;
}

/**
 * GET /api/client/projects/[id]/gallery/[galleryId]
 * Get gallery item by ID (only if it belongs to current client's project)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id: projectId, galleryId } = params;

    if (!projectId || !galleryId) {
      return NextResponse.json(
        { error: "Project ID and Gallery ID are required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyGalleryOwnership(galleryId, projectId, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Gallery item not found or access denied" },
        { status: 404 }
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

    if (error || !galleryItem) {
      console.error("Error fetching gallery item:", error);
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
 * PUT /api/client/projects/[id]/gallery/[galleryId]
 * Update gallery item (only if it belongs to current client's project)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id: projectId, galleryId } = params;

    if (!projectId || !galleryId) {
      return NextResponse.json(
        { error: "Project ID and Gallery ID are required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyGalleryOwnership(galleryId, projectId, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Gallery item not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, media_type, file_url, thumbnail_url, date } =
      body;

    // Build update object
    const updateData: ProjectGalleryUpdate = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (media_type !== undefined) updateData.media_type = media_type;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url || null;
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
 * DELETE /api/client/projects/[id]/gallery/[galleryId]
 * Delete gallery item (only if it belongs to current client's project)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id: projectId, galleryId } = params;

    if (!projectId || !galleryId) {
      return NextResponse.json(
        { error: "Project ID and Gallery ID are required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyGalleryOwnership(galleryId, projectId, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Gallery item not found or access denied" },
        { status: 404 }
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

