import { NextRequest, NextResponse } from "next/server";
import {
  typedTable,
  typedUpdate,
  typedInsert,
} from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  InvoiceDetailResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  DeleteInvoiceResponse,
} from "@/types/invoice.types";
import type {
  InvoiceRow,
  InvoiceUpdate,
  InvoiceItemRow,
  InvoiceItemInsert,
} from "@/types/supabase-database.types";

// Route segment config
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
 * GET /api/admin/invoices/[id]
 * Get invoice details with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    // Handle both sync and async params (Next.js 14 vs 15)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log("[Invoice GET] Requested ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Get invoice with basic relations
    const invoiceResult = await typedTable("invoices")
      .select(
        `
        *,
        project:projects!invoices_project_id_fkey (
          id,
          name,
          address
        ),
        template:invoice_templates!invoices_template_id_fkey (*)
        `
      )
      .eq("id", id)
      .single();

    const { data: invoice, error: invoiceError } = invoiceResult as {
      data: any | null;
      error: any;
    };

    if (invoiceError || !invoice) {
      console.error("[Invoice GET] Error:", invoiceError);
      console.error("[Invoice GET] Invoice data:", invoice);
      return NextResponse.json(
        { error: "Invoice not found", details: invoiceError?.message },
        { status: 404 }
      );
    }

    // Get client user data separately
    const clientUserResult = await typedTable("users")
      .select("id, full_name, email, phone")
      .eq("id", invoice.client_id)
      .single();
    const { data: clientUserData } = clientUserResult as {
      data:
        | (Pick<InvoiceRow, "id"> & {
            full_name: string;
            email: string;
            phone: string | null;
          })
        | null;
      error: any;
    };

    // Get client address data from clients table
    const clientAddressResult = await typedTable("clients")
      .select("address, city, postal_code, company_name, tax_id")
      .eq("user_id", invoice.client_id)
      .single();
    const { data: clientAddress } = clientAddressResult as {
      data: {
        address: string | null;
        city: string | null;
        postal_code: string | null;
        company_name: string | null;
        tax_id: string | null;
      } | null;
      error: any;
    };

    // Combine client data
    const client = clientUserData
      ? {
          id: clientUserData.id,
          full_name: clientUserData.full_name,
          email: clientUserData.email,
          phone: clientUserData.phone || null,
          address: clientAddress?.address || null,
          city: clientAddress?.city || null,
          postal_code: clientAddress?.postal_code || null,
          company_name: clientAddress?.company_name || null,
          tax_id: clientAddress?.tax_id || null,
        }
      : null;

    // Add client to invoice
    invoice.client = client;

    // Get invoice items
    const itemsResult = await typedTable("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("order_index", { ascending: true });

    const { data: items } = itemsResult as {
      data: InvoiceItemRow[] | null;
      error: any;
    };

    const response: InvoiceDetailResponse = {
      invoice: {
        ...invoice,
        items: items || [],
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/invoices/[id]
 * Update invoice
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const data: UpdateInvoiceRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Check if invoice exists
    const existingResult = await typedTable("invoices")
      .select("id, status")
      .eq("id", id)
      .single();
    const { data: existing } = existingResult as {
      data: Pick<InvoiceRow, "id" | "status"> | null;
      error: any;
    };

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: InvoiceUpdate = {};
    if (data.client_id !== undefined) updateData.client_id = data.client_id;
    if (data.project_id !== undefined) updateData.project_id = data.project_id;
    if (data.template_id !== undefined)
      updateData.template_id = data.template_id;
    if (data.issue_date !== undefined) updateData.issue_date = data.issue_date;
    if (data.due_date !== undefined) updateData.due_date = data.due_date;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tax_rate !== undefined) updateData.tax_rate = data.tax_rate;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.reference !== undefined) updateData.reference = data.reference;

    // Update status timestamps
    if (data.status === "sent" && existing.status !== "sent") {
      updateData.sent_at = new Date().toISOString();
    }
    if (data.status === "validated" && existing.status !== "validated") {
      updateData.validated_at = new Date().toISOString();
    }
    if (data.status === "paid" && existing.status !== "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    // Update invoice
    const updateResult = await typedUpdate("invoices", updateData)
      .eq("id", id)
      .select()
      .single();
    const { data: updatedInvoice, error: updateError } = updateResult as {
      data: InvoiceRow | null;
      error: any;
    };

    if (updateError) {
      console.error("Error updating invoice:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update items if provided
    if (data.items && data.items.length > 0) {
      // Delete existing items
      await typedTable("invoice_items").delete().eq("invoice_id", id);

      // Create new items
      const itemsData: InvoiceItemInsert[] = data.items.map((item, index) => ({
        invoice_id: id,
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
        console.error("Error updating invoice items:", itemsError);
        return NextResponse.json(
          { error: itemsError.message || "Failed to update invoice items" },
          { status: 500 }
        );
      }

      // Recalculate totals
      await (supabaseAdmin.rpc as any)("calculate_invoice_totals", {
        invoice_uuid: id,
      });
    }

    // Fetch complete updated invoice
    const completeResult = await typedTable("invoices")
      .select(
        `
        *,
        project:projects!invoices_project_id_fkey (
          id,
          name,
          address
        ),
        template:invoice_templates!invoices_template_id_fkey (*)
        `
      )
      .eq("id", id)
      .single();

    const { data: completeInvoice } = completeResult as {
      data: any;
      error: any;
    };

    // Get client user data separately
    const clientUserResult2 = await typedTable("users")
      .select("id, full_name, email, phone")
      .eq("id", completeInvoice.client_id)
      .single();
    const { data: clientUserData2 } = clientUserResult2 as {
      data:
        | (Pick<InvoiceRow, "id"> & {
            full_name: string;
            email: string;
            phone: string | null;
          })
        | null;
      error: any;
    };

    // Get client address data from clients table
    const clientAddressResult2 = await typedTable("clients")
      .select("address, city, postal_code, company_name, tax_id")
      .eq("user_id", completeInvoice.client_id)
      .single();
    const { data: clientAddress2 } = clientAddressResult2 as {
      data: {
        address: string | null;
        city: string | null;
        postal_code: string | null;
        company_name: string | null;
        tax_id: string | null;
      } | null;
      error: any;
    };

    // Combine client data
    const client2 = clientUserData2
      ? {
          id: clientUserData2.id,
          full_name: clientUserData2.full_name,
          email: clientUserData2.email,
          phone: clientUserData2.phone || null,
          address: clientAddress2?.address || null,
          city: clientAddress2?.city || null,
          postal_code: clientAddress2?.postal_code || null,
          company_name: clientAddress2?.company_name || null,
          tax_id: clientAddress2?.tax_id || null,
        }
      : null;

    // Add client to invoice
    completeInvoice.client = client2;

    // Fetch items
    const itemsResult2 = await typedTable("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("order_index", { ascending: true });

    const { data: invoiceItems } = itemsResult2 as {
      data: InvoiceItemRow[] | null;
      error: any;
    };

    const response: UpdateInvoiceResponse = {
      invoice: {
        ...completeInvoice,
        items: invoiceItems || [],
      },
      message: "Invoice updated successfully",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/invoices/[id]
 * Delete invoice (soft delete by setting status to cancelled)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const { searchParams } = request.nextUrl;
    const hard = searchParams.get("hard") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    if (hard) {
      // Hard delete: Delete invoice and items
      await typedTable("invoice_items").delete().eq("invoice_id", id);
      await typedTable("invoices").delete().eq("id", id);

      const response: DeleteInvoiceResponse = {
        message: "Invoice permanently deleted",
        deleted: true,
      };

      return NextResponse.json(response);
    } else {
      // Soft delete: Set status to cancelled
      const updateResult = await typedUpdate("invoices", {
        status: "cancelled",
      })
        .eq("id", id)
        .select()
        .single();

      const { error: updateError } = updateResult as { error: any };

      if (updateError) {
        console.error("Error cancelling invoice:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const response: DeleteInvoiceResponse = {
        message: "Invoice cancelled successfully",
        deleted: false,
      };

      return NextResponse.json(response);
    }
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
