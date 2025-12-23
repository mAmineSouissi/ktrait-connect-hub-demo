import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  TemplateListResponse,
  CreateTemplateResponse,
} from "@/types/invoice-template.types";
import type {
  InvoiceTemplateRow,
  InvoiceTemplateInsert,
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
 * GET /api/admin/invoice-templates
 * List all invoice templates
 * Query params: type, is_active, is_default
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
    const is_active = searchParams.get("is_active");
    const is_default = searchParams.get("is_default");

    // Build query
    let query = typedTable("invoice_templates")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply filters
    if (type) {
      query = query.eq("type", type);
    }
    if (is_active !== null && is_active !== undefined && is_active !== "") {
      const isActiveBool = is_active === "true" || is_active === "1";
      query = query.eq("is_active", isActiveBool);
    }
    if (is_default !== null && is_default !== undefined && is_default !== "") {
      const isDefaultBool = is_default === "true" || is_default === "1";
      query = query.eq("is_default", isDefaultBool);
    }

    const result = await query;

    const {
      data: templates,
      error,
      count,
    } = result as {
      data: InvoiceTemplateRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching templates:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: TemplateListResponse = {
      templates: templates || [],
      total: count || 0,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/admin/invoice-templates:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/invoice-templates
 * Create a new invoice template
 * Expects multipart/form-data with template_file
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
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string | null;
    const template_file = formData.get("template_file") as File;
    const template_file_type = formData.get("template_file_type") as string;
    const is_default = formData.get("is_default") === "true";
    const is_active = formData.get("is_active") !== "false";

    // Validate required fields
    if (!name || !type || !template_file || !template_file_type) {
      return NextResponse.json(
        {
          error:
            "name, type, template_file, and template_file_type are required",
        },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== "devis" && type !== "facture") {
      return NextResponse.json(
        { error: "type must be 'devis' or 'facture'" },
        { status: 400 }
      );
    }

    // Validate file type
    if (template_file_type !== "pdf" && template_file_type !== "html") {
      return NextResponse.json(
        { error: "template_file_type must be 'pdf' or 'html'" },
        { status: 400 }
      );
    }

    // Get current user for created_by
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const created_by = user?.id || null;

    // Upload template file to Supabase Storage
    const fileExt = template_file.name.split(".").pop();
    const fileName = `invoice-templates/${type}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(fileName, template_file, {
        contentType: template_file.type,
        upsert: false,
      });

    if (uploadError || !uploadData) {
      console.error("Error uploading template file:", uploadError);
      return NextResponse.json(
        { error: uploadError?.message || "Failed to upload template file" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("documents").getPublicUrl(fileName);

    // If this is set as default, unset other defaults of the same type
    if (is_default) {
      await typedTable("invoice_templates")
        .update({ is_default: false })
        .eq("type", type)
        .eq("is_default", true);
    }

    // Create template record
    const templateData: InvoiceTemplateInsert = {
      name,
      type: type as "devis" | "facture",
      description: description || null,
      template_file_url: publicUrl,
      template_file_type: template_file_type as "pdf" | "html",
      is_default: is_default || false,
      is_active: is_active !== false,
      created_by,
    };

    const templateResult = await typedInsert("invoice_templates", templateData)
      .select()
      .single();
    const { data: template, error: templateError } = templateResult as {
      data: InvoiceTemplateRow | null;
      error: any;
    };

    if (templateError || !template) {
      // Rollback: delete uploaded file if template creation fails
      await supabaseAdmin.storage.from("documents").remove([fileName]);
      console.error("Error creating template:", templateError);
      return NextResponse.json(
        { error: templateError?.message || "Failed to create template" },
        { status: 500 }
      );
    }

    const response: CreateTemplateResponse = {
      template,
      message: "Template created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/invoice-templates:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
