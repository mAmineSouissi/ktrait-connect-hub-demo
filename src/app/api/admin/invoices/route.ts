import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  InvoiceListResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
} from "@/types/invoice.types";
import type {
  InvoiceRow,
  InvoiceInsert,
  InvoiceItemInsert,
} from "@/types/supabase-database.types";

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
 * GET /api/admin/invoices
 * List all invoices with filters, pagination, and sorting
 * Query params: type, client_id, project_id, status, search, limit, offset, sortKey, order
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
    const type = searchParams.get("type");
    const client_id = searchParams.get("client_id");
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Build query
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

    // Apply filters
    if (type) {
      query = query.eq("type", type);
    }
    if (client_id) {
      query = query.eq("client_id", client_id);
    }
    if (project_id) {
      query = query.eq("project_id", project_id);
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
    console.error("Error in GET /api/admin/invoices:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/invoices
 * Create a new invoice (devis or facture)
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
    const body: CreateInvoiceRequest = await request.json();
    const {
      type,
      client_id,
      project_id,
      template_id,
      issue_date,
      due_date,
      tax_rate = 20.0,
      notes,
      terms,
      reference,
      items,
    } = body;

    // Validate required fields
    if (!type || !client_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: "type, client_id, and items are required" },
        { status: 400 }
      );
    }

    // Get current user for created_by
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const created_by = user?.id || null;

    // Generate invoice number using database function
    const { data: generatedNumber, error: genError } = await (
      supabaseAdmin.rpc as any
    )("generate_invoice_number", {
      invoice_type: type,
    });
    if (genError || !generatedNumber) {
      console.error("Error generating invoice number:", genError);
      return NextResponse.json(
        { error: "Failed to generate invoice number" },
        { status: 500 }
      );
    }
    const invoice_number = generatedNumber;

    // Calculate initial totals (will be recalculated by trigger)
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const tax_amount = subtotal * (tax_rate / 100);
    const total_amount = subtotal + tax_amount;

    // Create invoice
    const invoiceData: InvoiceInsert = {
      invoice_number,
      type,
      client_id,
      project_id: project_id || null,
      template_id: template_id || null,
      issue_date: issue_date || new Date().toISOString().split("T")[0],
      due_date: due_date || null,
      status: "draft",
      subtotal,
      tax_rate,
      tax_amount,
      total_amount,
      notes: notes || null,
      terms: terms || null,
      reference: reference || null,
      created_by,
    };

    const invoiceResult = await typedInsert("invoices", invoiceData)
      .select()
      .single();
    const { data: invoice, error: invoiceError } = invoiceResult as {
      data: InvoiceRow | null;
      error: any;
    };

    if (invoiceError || !invoice) {
      console.error("Error creating invoice:", invoiceError);
      return NextResponse.json(
        { error: invoiceError?.message || "Failed to create invoice" },
        { status: 500 }
      );
    }

    // Create invoice items
    const itemsData: InvoiceItemInsert[] = items.map((item, index) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      unit: item.unit || null,
      tax_rate: item.tax_rate || null,
      line_total: item.quantity * item.unit_price,
      order_index: index,
    }));

    const itemsResult = await typedInsert("invoice_items", itemsData);
    const { error: itemsError } = itemsResult as { error: any };

    if (itemsError) {
      // Rollback: delete invoice if items creation fails
      await typedTable("invoices").delete().eq("id", invoice.id);
      console.error("Error creating invoice items:", itemsError);
      return NextResponse.json(
        { error: itemsError.message || "Failed to create invoice items" },
        { status: 500 }
      );
    }

    // Recalculate totals (trigger should do this, but let's be explicit)
    await (supabaseAdmin.rpc as any)("calculate_invoice_totals", {
      invoice_uuid: invoice.id,
    });

    // Fetch complete invoice with relations
    const completeInvoiceResult = await typedTable("invoices")
      .select(
        `
        *,
        client:users!invoices_client_id_fkey (
          id,
          full_name,
          email,
          phone,
          address,
          city,
          postal_code,
          company_name,
          tax_id
        ),
        project:projects!invoices_project_id_fkey (
          id,
          name,
          address
        ),
        template:invoice_templates!invoices_template_id_fkey (*)
        `
      )
      .eq("id", invoice.id)
      .single();

    const { data: completeInvoice } = completeInvoiceResult as {
      data: any;
      error: any;
    };

    // Fetch items
    const itemsResult2 = await typedTable("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.id)
      .order("order_index", { ascending: true });

    const { data: invoiceItems } = itemsResult2 as {
      data: any[] | null;
      error: any;
    };

    const response: CreateInvoiceResponse = {
      invoice: {
        ...completeInvoice,
        items: invoiceItems || [],
      },
      message: "Invoice created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/invoices:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
