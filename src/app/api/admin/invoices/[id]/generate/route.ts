import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { InvoiceWithDetails } from "@/types/invoice.types";

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
 * GET /api/admin/invoices/[id]/generate
 * Generate invoice HTML/PDF with template data replacement
 * Query params: format (html|pdf), preview (true|false)
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
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const { searchParams } = request.nextUrl;
    const format = searchParams.get("format") || "html";
    const preview = searchParams.get("preview") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Get invoice with all relations
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
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Get client user data
    const clientUserResult = await typedTable("users")
      .select("id, full_name, email, phone")
      .eq("id", invoice.client_id)
      .single();
    const { data: clientUserData } = clientUserResult as {
      data: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
      } | null;
      error: any;
    };

    // Get client address data
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

    // Get invoice items
    const itemsResult = await typedTable("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("order_index", { ascending: true });

    const { data: items } = itemsResult as {
      data: any[] | null;
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

    const invoiceWithDetails: InvoiceWithDetails = {
      ...invoice,
      client,
      items: items || [],
    };

    // Get template
    let templateContent = "";
    const supabaseAdmin = getSupabaseAdmin();

    if (invoice.template?.template_file_url) {
      try {
        // Fetch template from URL
        const templateResponse = await fetch(
          invoice.template.template_file_url
        );
        if (templateResponse.ok) {
          templateContent = await templateResponse.text();
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    }

    // If no template or template fetch failed, use default template
    if (!templateContent) {
      // Use a simple default template
      templateContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${invoice.type === "devis" ? "Devis" : "Facture"} - ${
        invoice.invoice_number
      }</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>INVOICE_TYPE</h1>
            <p>N° INVOICE_NUMBER</p>
            <p>Date: ISSUE_DATE</p>
            <p>Échéance: DUE_DATE</p>
        </div>
    </div>
    <div>
        <h3>Client</h3>
        <p>CLIENT_NAME</p>
        <p>CLIENT_COMPANY_NAME</p>
        <p>CLIENT_ADDRESS</p>
        <p>CLIENT_CITY CLIENT_POSTAL_CODE</p>
        <p>Email: CLIENT_EMAIL</p>
        <p>Tél: CLIENT_PHONE</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right">Qté</th>
                <th class="text-right">Prix unitaire</th>
                <th class="text-right">Total HT</th>
            </tr>
        </thead>
        <tbody>
            ITEMS_ROWS
        </tbody>
    </table>
    <div class="totals">
        <p>Sous-total HT: SUBTOTAL €</p>
        <p>TVA (TAX_RATE%): TAX_AMOUNT €</p>
        <p><strong>Total TTC: TOTAL_AMOUNT €</strong></p>
    </div>
    <div>
        <h4>Notes</h4>
        <p>NOTES_CONTENT</p>
        <h4>Conditions de paiement</h4>
        <p>TERMS_CONTENT</p>
        <h4>Référence</h4>
        <p>REFERENCE_CONTENT</p>
    </div>
</body>
</html>`;
    }

    // Replace placeholders
    let processedContent = templateContent;

    // Invoice basic info
    processedContent = processedContent.replace(
      /INVOICE_NUMBER/g,
      invoice.invoice_number || ""
    );
    processedContent = processedContent.replace(
      /INVOICE_TYPE/g,
      invoice.type === "devis" ? "DEVIS" : "FACTURE"
    );
    processedContent = processedContent.replace(
      /ISSUE_DATE/g,
      invoice.issue_date
        ? new Date(invoice.issue_date).toLocaleDateString("fr-FR")
        : ""
    );
    processedContent = processedContent.replace(
      /DUE_DATE/g,
      invoice.due_date
        ? new Date(invoice.due_date).toLocaleDateString("fr-FR")
        : "N/A"
    );

    // Client info
    if (client) {
      processedContent = processedContent.replace(
        /CLIENT_NAME/g,
        client.full_name || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_COMPANY_NAME/g,
        client.company_name || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_ADDRESS/g,
        client.address || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_CITY/g,
        client.city || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_POSTAL_CODE/g,
        client.postal_code || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_EMAIL/g,
        client.email || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_PHONE/g,
        client.phone || ""
      );
      processedContent = processedContent.replace(
        /CLIENT_TAX_ID/g,
        client.tax_id || ""
      );
    }

    // Items
    if (items && items.length > 0) {
      // Generate items rows
      let itemsRows = "";
      items.forEach((item, index) => {
        const itemNum = index + 1;
        itemsRows += `<tr>
            <td>${item.description || ""}</td>
            <td class="text-right">${item.quantity || 0}</td>
            <td class="text-right">${item.unit || "unité"}</td>
            <td class="text-right">${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(item.unit_price || 0)}</td>
            <td class="text-right">${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format((item.quantity || 0) * (item.unit_price || 0))}</td>
        </tr>`;

        // Replace item placeholders
        processedContent = processedContent.replace(
          new RegExp(`ITEM_DESCRIPTION_${itemNum}`, "g"),
          item.description || ""
        );
        processedContent = processedContent.replace(
          new RegExp(`ITEM_QUANTITY_${itemNum}`, "g"),
          String(item.quantity || 0)
        );
        processedContent = processedContent.replace(
          new RegExp(`ITEM_UNIT_${itemNum}`, "g"),
          item.unit || "unité"
        );
        processedContent = processedContent.replace(
          new RegExp(`ITEM_UNIT_PRICE_${itemNum}`, "g"),
          new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(item.unit_price || 0)
        );
        processedContent = processedContent.replace(
          new RegExp(`ITEM_LINE_TOTAL_${itemNum}`, "g"),
          new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format((item.quantity || 0) * (item.unit_price || 0))
        );
      });

      // Replace ITEMS_ROWS placeholder
      processedContent = processedContent.replace(/ITEMS_ROWS/g, itemsRows);
    } else {
      processedContent = processedContent.replace(
        /ITEMS_ROWS/g,
        "<tr><td colspan='5' class='text-center'>Aucun article</td></tr>"
      );
    }

    // Totals
    const subtotal = invoice.subtotal || 0;
    const taxRate = invoice.tax_rate || 0;
    const taxAmount = invoice.tax_amount || 0;
    const totalAmount = invoice.total_amount || 0;

    processedContent = processedContent.replace(
      /SUBTOTAL/g,
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(subtotal)
    );
    processedContent = processedContent.replace(/TAX_RATE/g, String(taxRate));
    processedContent = processedContent.replace(
      /TAX_AMOUNT/g,
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(taxAmount)
    );
    processedContent = processedContent.replace(
      /TOTAL_AMOUNT/g,
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(totalAmount)
    );

    // Notes, terms, reference
    processedContent = processedContent.replace(
      /NOTES_CONTENT/g,
      invoice.notes || "Aucune note"
    );
    processedContent = processedContent.replace(
      /TERMS_CONTENT/g,
      invoice.terms || "Aucune condition spécifiée"
    );
    processedContent = processedContent.replace(
      /REFERENCE_CONTENT/g,
      invoice.reference || "N/A"
    );

    // Return response
    if (format === "pdf") {
      // For PDF, we'd need a library like puppeteer or use a service
      // For now, return HTML with instructions
      return NextResponse.json(
        {
          error:
            "PDF generation not yet implemented. Please use format=html for now.",
        },
        { status: 501 }
      );
    }

    // Return HTML
    return new NextResponse(processedContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ...(preview
          ? {}
          : {
              "Content-Disposition": `attachment; filename="${
                invoice.invoice_number || "invoice"
              }.html"`,
            }),
      },
    });
  } catch (error: any) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



