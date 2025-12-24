import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectGalleryRow,
  ProjectGalleryInsert,
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
 * GET /api/client/projects/[id]/gallery
 * List all gallery items for a project (only if it belongs to current client)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: projectExists, error: projectError } = projectCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (projectError || !projectExists) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("project_gallery")
      .select("*")
      .eq("project_id", id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    const { data: gallery, error } = result as {
      data: ProjectGalleryRow[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching gallery:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ gallery: gallery || [] });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/projects/[id]/gallery
 * Create a new gallery item for a project (only if it belongs to current client)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: projectExists, error: projectError } = projectCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (projectError || !projectExists) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      media_type = "photo",
      file_url,
      thumbnail_url,
      date,
    } = body;

    // Validate required fields
    if (!title || !file_url) {
      return NextResponse.json(
        {
          error: "title and file_url are required",
        },
        { status: 400 }
      );
    }

    // Create gallery item
    const galleryData: ProjectGalleryInsert = {
      project_id: id,
      title,
      description: description || null,
      media_type,
      file_url,
      thumbnail_url: thumbnail_url || null,
      date: date || null,
    };

    const result = await typedInsert("project_gallery", galleryData)
      .select()
      .single();

    const { data: galleryItem, error } = result as {
      data: ProjectGalleryRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating gallery item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        galleryItem,
        message: "Gallery item created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

