import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { InvoiceRow } from "@/types/supabase-database.types";
import type { InvoiceListResponse } from "@/types/invoice.types";

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
 * GET /api/client/invoices
 * List invoices for the current client (optionally filtered by type, project_id, status)
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
    const type = searchParams.get("type");
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Build query with related data
    let query = typedTable("invoices").select(
      `
        *,
        client:users!invoices_client_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        project:projects!invoices_project_id_fkey (
          id,
          name
        ),
        template:invoice_templates!invoices_template_id_fkey (
          id,
          name,
          type,
          template_file_url
        )
        `,
      { count: "exact" }
    );

    // Always filter by client_id
    query = query.eq("client_id", clientId);

    // Apply additional filters
    if (type) {
      query = query.eq("type", type);
    }
    if (project_id) {
      // Verify project belongs to this client
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
      }
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (search) {
      query = query.or(
        `invoice_number.ilike.%${search}%,notes.ilike.%${search}%,reference.ilike.%${search}%`
      );
    }

    // Apply sorting
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortKey, { ascending });

    // Apply pagination
    const result = await query.range(offset, offset + limit - 1);

    const {
      data: invoices,
      error,
      count,
    } = result as {
      data: any[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching invoices:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format response
    const formattedInvoices = (invoices || []).map((invoice: any) => ({
      ...invoice,
      client: invoice.client || null,
      project: invoice.project || null,
      template: invoice.template || null,
    }));

    const response: InvoiceListResponse = {
      invoices: formattedInvoices,
      total: count || 0,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/client/invoices:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

