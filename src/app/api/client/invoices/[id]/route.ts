import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { InvoiceRow, InvoiceItemRow } from "@/types/supabase-database.types";
import type { InvoiceDetailResponse } from "@/types/invoice.types";

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
 * GET /api/client/invoices/[id]
 * Get invoice details with items (only if it belongs to current client)
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
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Get invoice with related data
    const invoiceResult = await typedTable("invoices")
      .select(
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
          name,
          address
        ),
        template:invoice_templates!invoices_template_id_fkey (
          id,
          name,
          type,
          template_file_url
        )
        `
      )
      .eq("id", id)
      .eq("client_id", clientId) // Ensure invoice belongs to this client
      .single();

    const { data: invoice, error: invoiceError } = invoiceResult as {
      data: any | null;
      error: any;
    };

    if (invoiceError || !invoice) {
      console.error("Error fetching invoice:", invoiceError);
      return NextResponse.json(
        { error: "Invoice not found or access denied" },
        { status: 404 }
      );
    }

    // Get invoice items
    const itemsResult = await typedTable("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("order_index", { ascending: true });

    const { data: items, error: itemsError } = itemsResult as {
      data: InvoiceItemRow[] | null;
      error: any;
    };

    if (itemsError) {
      console.error("Error fetching invoice items:", itemsError);
      return NextResponse.json(
        { error: "Failed to fetch invoice items" },
        { status: 500 }
      );
    }

    // Get client details from clients table if available
    const clientDetailsResult = await typedTable("clients")
      .select("address, city, postal_code, company_name, tax_id")
      .eq("user_id", clientId)
      .single();
    
    const { data: clientDetails } = clientDetailsResult as {
      data: {
        address?: string | null;
        city?: string | null;
        postal_code?: string | null;
        company_name?: string | null;
        tax_id?: string | null;
      } | null;
      error: any;
    };

    // Format response with all details
    const invoiceWithDetails = {
      ...invoice,
      client: invoice.client
        ? {
            ...invoice.client,
            address: clientDetails?.address || null,
            city: clientDetails?.city || null,
            postal_code: clientDetails?.postal_code || null,
            company_name: clientDetails?.company_name || null,
            tax_id: clientDetails?.tax_id || null,
          }
        : null,
      project: invoice.project || null,
      template: invoice.template || null,
      items: items || [],
    };

    const response: InvoiceDetailResponse = {
      invoice: invoiceWithDetails,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/client/invoices/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

