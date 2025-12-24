import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { DocumentRow, DocumentUpdate } from "@/types/supabase-database.types";

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
 * GET /api/client/documents/[id]
 * Get document details (only if it belongs to current client)
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
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get document and verify it belongs to this client
    const result = await typedTable("documents")
      .select("*")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();

    const { data: document, error } = result as {
      data: DocumentRow | null;
      error: any;
    };

    if (error || !document) {
      console.error("Error fetching document:", error);
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/documents/[id]
 * Update document (only if it belongs to current client)
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
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // First verify the document belongs to this client
    const docCheck = await typedTable("documents")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: docExists, error: checkError } = docCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (checkError || !docExists) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      file_type,
      folder,
      file_url,
      file_size,
      status,
    } = body;

    // Build update object
    const updateData: DocumentUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (file_type !== undefined) updateData.file_type = file_type || null;
    if (folder !== undefined) updateData.folder = folder || null;
    if (file_url !== undefined) updateData.file_url = file_url || null;
    if (file_size !== undefined) updateData.file_size = file_size || null;
    if (status !== undefined) updateData.status = status;

    const result = await typedUpdate("documents", updateData)
      .eq("id", id)
      .eq("client_id", clientId) // Double-check ownership
      .select()
      .single();

    const { data: document, error } = result as {
      data: DocumentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating document:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      document,
      message: "Document updated successfully",
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
 * DELETE /api/client/documents/[id]
 * Delete document (only if it belongs to current client)
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
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Verify the document belongs to this client before deleting
    const docCheck = await typedTable("documents")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: docExists, error: checkError } = docCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (checkError || !docExists) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await typedTable("documents")
      .delete()
      .eq("id", id)
      .eq("client_id", clientId); // Double-check ownership

    if (error) {
      console.error("Error deleting document:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Document deleted successfully",
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

