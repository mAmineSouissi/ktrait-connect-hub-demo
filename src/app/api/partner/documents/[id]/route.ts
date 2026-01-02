import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  DocumentRow,
  DocumentUpdate,
} from "@/types/supabase-database.types";

/**
 * Get current partner ID from authenticated user
 */
async function getCurrentPartnerId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "partner") {
      return null;
    }

    // Get partner_id from partners_profile
    const profileResult = await typedTable("partners_profile")
      .select("partner_id")
      .eq("user_id", user.id)
      .single();

    const { data: profile } = profileResult as {
      data: { partner_id: string } | null;
      error: any;
    };

    return profile?.partner_id || null;
  } catch (error) {
    console.error("Error checking partner:", error);
    return null;
  }
}

/**
 * PUT /api/partner/documents/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
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

    // First verify the document exists and partner has access
    const docCheck = await typedTable("documents")
      .select("id, partner_id, project_id")
      .eq("id", id)
      .single();

    const { data: docExists, error: checkError } = docCheck as {
      data: {
        id: string;
        partner_id: string | null;
        project_id: string | null;
      } | null;
      error: any;
    };

    if (checkError || !docExists) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify access: partner created it OR partner is assigned to project
    let hasAccess = docExists.partner_id === partnerId;

    if (!hasAccess && docExists.project_id) {
      const projectPartnerResult = await typedTable("project_partners")
        .select("id")
        .eq("project_id", docExists.project_id)
        .eq("partner_id", partnerId)
        .single();

      const { data: projectPartner } = projectPartnerResult as {
        data: { id: string } | null;
        error: any;
      };

      hasAccess = !!projectPartner;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, file_type, folder, file_url, file_size, status } = body;

    // Build update object
    const updateData: DocumentUpdate = {};
    if (name !== undefined) {
      if (!name || !name.trim()) {
        return NextResponse.json(
          { error: "name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }
    if (file_type !== undefined) updateData.file_type = file_type || null;
    if (folder !== undefined) updateData.folder = folder || null;
    if (file_url !== undefined) updateData.file_url = file_url || null;
    if (file_size !== undefined) updateData.file_size = file_size || null;
    if (status !== undefined) updateData.status = status;

    // Update document
    const result = await typedTable("documents")
      .update(updateData)
      .eq("id", id)
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

    if (!document) {
      return NextResponse.json(
        { error: "Document not found after update" },
        { status: 404 }
      );
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
 * DELETE /api/partner/documents/[id]
 * Delete document (only if partner created it)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
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

    // Verify the document exists and was created by this partner
    const docCheck = await typedTable("documents")
      .select("id, partner_id")
      .eq("id", id)
      .eq("partner_id", partnerId) // Only allow deletion of documents created by this partner
      .single();

    const { data: docExists, error: checkError } = docCheck as {
      data: { id: string; partner_id: string | null } | null;
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
      .eq("partner_id", partnerId); // Double-check ownership

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
