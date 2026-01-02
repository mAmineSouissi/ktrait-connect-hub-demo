import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  DocumentRow,
  DocumentInsert,
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
 * GET /api/partner/documents
 * List all documents from projects assigned to the current partner
 * Query params: project_id, client_id, folder, status, search, limit, offset, sortKey, order
 */
export async function GET(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const client_id = searchParams.get("client_id");
    const folder = searchParams.get("folder");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "uploaded_at";
    const order = searchParams.get("order") || "desc";

    let query = typedTable("documents")
      .select(
        `
        *,
        project:projects!documents_project_id_fkey (
          id,
          name,
          client_id
        )
      `,
        { count: "exact" }
      )
      .eq("partner_id", partnerId);

    // Apply filters
    if (client_id) {
      query = query.eq("client_id", client_id);
    }

    if (folder) {
      query = query.eq("folder", folder);
    }

    if (status) {
      query = query.eq("status", status);
    }

    // Search filter
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Order by
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortKey, { ascending });

    // Pagination
    const result = await query.range(offset, offset + limit - 1);

    const {
      data: documents,
      error,
      count,
    } = result as {
      data:
        | (DocumentRow & {
            project: { id: string; name: string; client_id: string } | null;
          })[]
        | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format response
    const formattedDocuments = (documents || []).map((doc) => ({
      ...doc,
      project_name: doc.project?.name ?? null,
    }));

    return NextResponse.json({
      documents: formattedDocuments,
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partner/documents
 * Create a new document for a project (only if partner is assigned to the project)
 */
export async function POST(request: NextRequest) {
  const partnerId = await getCurrentPartnerId();

  if (!partnerId) {
    return NextResponse.json(
      { error: "Forbidden: Partner access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      project_id,
      name,
      file_type,
      folder,
      file_url,
      file_size,
      status = "en_attente",
    } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id is required" },
        { status: 400 }
      );
    }

    // Verify partner is assigned to this project
    const projectPartnerResult = await typedTable("project_partners")
      .select("id")
      .eq("project_id", project_id)
      .eq("partner_id", partnerId)
      .single();

    const { data: projectPartner } = projectPartnerResult as {
      data: { id: string } | null;
      error: any;
    };

    if (!projectPartner) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Verify project exists
    const projectResult = await typedTable("projects")
      .select("id, client_id")
      .eq("id", project_id)
      .single();

    const { data: project, error: projectError } = projectResult as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create document
    const documentData: DocumentInsert = {
      partner_id: partnerId, // Set partner_id to current partner
      project_id,
      client_id: project.client_id, // Set client_id from project
      name: name.trim(),
      file_type: file_type || null,
      folder: folder || null,
      file_url: file_url || null,
      file_size: file_size || null,
      status,
    };

    const result = await typedInsert("documents", documentData)
      .select()
      .single();

    const { data: document, error } = result as {
      data: DocumentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating document:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        document,
        message: "Document created successfully",
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
