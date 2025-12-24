import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ProjectPartnerRow,
  ProjectPartnerUpdate,
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
 * PUT /api/client/projects/[id]/partners/[partnerId]
 * Update project partner relationship (only if project belongs to current client)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; partnerId: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id: projectId, partnerId } = params;

    if (!projectId || !partnerId) {
      return NextResponse.json(
        { error: "Project ID and Partner ID are required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", projectId)
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

    // Verify the project partner relationship exists
    const partnerCheck = await typedTable("project_partners")
      .select("id, project_id")
      .eq("id", partnerId)
      .eq("project_id", projectId)
      .single();
    
    const { data: partnerExists } = partnerCheck as {
      data: { id: string; project_id: string } | null;
      error: any;
    };

    if (!partnerExists) {
      return NextResponse.json(
        { error: "Project partner relationship not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { role, is_primary } = body;

    // Build update object
    const updateData: ProjectPartnerUpdate = {};
    if (role !== undefined) updateData.role = role || null;
    if (is_primary !== undefined) {
      updateData.is_primary = is_primary;

      // If setting as primary, unset other primary partners for this project
      if (is_primary) {
        await typedTable("project_partners")
          .update({ is_primary: false })
          .eq("project_id", projectId)
          .eq("is_primary", true)
          .neq("id", partnerId);
      }
    }

    const result = await typedUpdate("project_partners", updateData)
      .eq("id", partnerId)
      .select(
        `
        *,
        partner:partners(id, name, type, contact_person, email, phone, address, city, status)
      `
      )
      .single();

    const { data: projectPartner, error } = result as {
      data: (ProjectPartnerRow & { partner: any }) | null;
      error: any;
    };

    if (error) {
      console.error("Error updating project partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      projectPartner: {
        id: projectPartner?.id,
        project_id: projectPartner?.project_id,
        partner_id: projectPartner?.partner_id,
        role: projectPartner?.role,
        is_primary: projectPartner?.is_primary,
        created_at: projectPartner?.created_at,
        partner: projectPartner?.partner || null,
      },
      message: "Partner updated successfully",
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
 * DELETE /api/client/projects/[id]/partners/[partnerId]
 * Remove partner from project (only if project belongs to current client)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; partnerId: string } }
) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { id: projectId, partnerId } = params;

    if (!projectId || !partnerId) {
      return NextResponse.json(
        { error: "Project ID and Partner ID are required" },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", projectId)
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

    // Verify the project partner relationship exists
    const partnerCheck = await typedTable("project_partners")
      .select("id, project_id")
      .eq("id", partnerId)
      .eq("project_id", projectId)
      .single();
    
    const { data: partnerExists } = partnerCheck as {
      data: { id: string; project_id: string } | null;
      error: any;
    };

    if (!partnerExists) {
      return NextResponse.json(
        { error: "Project partner relationship not found" },
        { status: 404 }
      );
    }

    const { error } = await typedTable("project_partners")
      .delete()
      .eq("id", partnerId);

    if (error) {
      console.error("Error deleting project partner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Partner removed from project successfully",
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

