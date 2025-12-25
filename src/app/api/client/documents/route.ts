import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { DocumentRow, DocumentInsert } from "@/types/supabase-database.types";

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
 * GET /api/client/documents
 * List documents for the current client's projects
 * Query params: project_id, folder, status, limit, offset
 */
export async function GET(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const project_id = searchParams.get("project_id");
    const folder = searchParams.get("folder");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "uploaded_at";
    const order = searchParams.get("order") || "desc";

    // Build query - only documents for this client's projects
    let query = typedTable("documents").select(
      `
      *,
      project:projects!documents_project_id_fkey (
        id,
        name,
        client_id
      )
      `,
      { count: "exact" }
    );

    // Always filter by client_id to ensure clients only see their own documents
    query = query.eq("client_id", clientId);

    // Additional filters
    if (project_id) {
      // Verify the project belongs to this client
      const projectCheck = await typedTable("projects")
        .select("id, client_id")
        .eq("id", project_id)
        .eq("client_id", clientId)
        .single();
      
      const { data: projectExists } = projectCheck as {
        data: { id: string; client_id: string } | null;
        error: any;
      };

      if (projectExists) {
        query = query.eq("project_id", project_id);
      } else {
        // Project doesn't belong to client, return empty
        return NextResponse.json({
          documents: [],
          total: 0,
        });
      }
    }
    if (folder) query = query.eq("folder", folder);
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,file_type.ilike.%${search}%,folder.ilike.%${search}%`
      );
    }

    // Apply sorting
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortKey, { ascending });

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const documentsWithDetails = (data || []).map((doc: any) => ({
      ...doc,
      project_name: doc.project?.name ?? null,
    }));

    return NextResponse.json({
      documents: documentsWithDetails,
      total: count ?? 0,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/documents
 * Create a new document for the current client's project
 */
export async function POST(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
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
    if (!name) {
      return NextResponse.json(
        {
          error: "name is required",
        },
        { status: 400 }
      );
    }

    if (!project_id) {
      return NextResponse.json(
        {
          error: "project_id is required",
        },
        { status: 400 }
      );
    }

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", project_id)
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

    // Create document
    const documentData: DocumentInsert = {
      client_id: clientId, // Automatically set to current client
      project_id,
      name,
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

