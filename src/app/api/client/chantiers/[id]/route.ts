import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ChantierRow,
  ChantierUpdate,
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
 * Verify chantier belongs to client's project
 */
async function verifyChantierOwnership(
  chantierId: string,
  clientId: string
): Promise<boolean> {
  const chantierResult = await typedTable("chantiers")
    .select("project_id, project:projects!chantiers_project_id_fkey(client_id)")
    .eq("id", chantierId)
    .single();

  const { data: chantier } = chantierResult as {
    data: { project_id: string; project?: { client_id: string } } | null;
    error: any;
  };

  if (!chantier || !chantier.project) {
    return false;
  }

  return chantier.project.client_id === clientId;
}

/**
 * GET /api/client/chantiers/[id]
 * Get chantier details (only if it belongs to current client's project)
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
        { error: "Chantier ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyChantierOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Chantier not found or access denied" },
        { status: 404 }
      );
    }

    const { data: chantier, error } = await typedTable("chantiers")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !chantier) {
      return NextResponse.json(
        { error: "Chantier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chantier });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/chantiers/[id]
 * Update chantier (only if it belongs to current client's project)
 */
export async function PUT(
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
        { error: "Chantier ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyChantierOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Chantier not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      location,
      description,
      status,
      progress,
      start_date,
      end_date,
    } = body;

    // Build update object
    const updateData: ChantierUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description || null;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;

    const { data: updatedChantier, error } = await typedTable("chantiers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating chantier:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      chantier: updatedChantier,
      message: "Chantier updated successfully",
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
 * DELETE /api/client/chantiers/[id]
 * Delete chantier (only if it belongs to current client's project)
 */
export async function DELETE(
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
        { error: "Chantier ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyChantierOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Chantier not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await typedTable("chantiers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting chantier:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Chantier deleted successfully",
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

