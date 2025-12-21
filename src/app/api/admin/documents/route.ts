import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";

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
 * GET /api/admin/documents
 * List all documents with filters
 * Query params: client_id, project_id, partner_id, folder, status, limit, offset
 */
export async function GET(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const client_id = searchParams.get("client_id");
    const project_id = searchParams.get("project_id");
    const partner_id = searchParams.get("partner_id");
    const folder = searchParams.get("folder");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    let query = typedTable("documents").select(
      `
      *,
      client:users!documents_client_id_fkey (
        full_name
      ),
      project:projects!documents_project_id_fkey (
        name
      ),
      partner:partners!documents_partner_id_fkey (
        name
      )
      `,
      { count: "exact" }
    );

    // Filters
    if (client_id) query = query.eq("client_id", client_id as string);
    if (project_id) query = query.eq("project_id", project_id as string);
    if (partner_id) query = query.eq("partner_id", partner_id as string);
    if (folder) query = query.eq("folder", folder as string);
    if (status) query = query.eq("status", status as string);

    query = query.order("uploaded_at", { ascending: false });

    const { data, error, count } = await query.range(
      Number(offset),
      Number(offset) + Number(limit) - 1
    );

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const documentsWithDetails = (data || []).map((doc: any) => ({
      ...doc,
      client_name: doc.client?.full_name ?? null,
      project_name: doc.project?.name ?? null,
      partner_name: doc.partner?.name ?? null,
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
 * POST /api/admin/documents
 * Create a new document
 */
export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const {
      client_id,
      project_id,
      partner_id,
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

    // Ensure at least one relation exists
    if (!client_id && !project_id && !partner_id) {
      return NextResponse.json(
        {
          error:
            "At least one of client_id, project_id, or partner_id is required",
        },
        { status: 400 }
      );
    }

    // Create document
    const { data: document, error } = await (
      supabaseAdmin.from("documents") as any
    )
      .insert({
        client_id: client_id || null,
        project_id: project_id || null,
        partner_id: partner_id || null,
        name,
        file_type: file_type || null,
        folder: folder || null,
        file_url: file_url || null,
        file_size: file_size || null,
        status,
      })
      .select()
      .single();

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
