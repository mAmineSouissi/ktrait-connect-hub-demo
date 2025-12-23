import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  TemplateDetailResponse,
  UpdateTemplateResponse,
  DeleteTemplateResponse,
} from "@/types/invoice-template.types";
import type {
  InvoiceTemplateRow,
  InvoiceTemplateUpdate,
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
 * GET /api/admin/invoice-templates/[id]
 * Get template details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    const templateResult = await typedTable("invoice_templates")
      .select("*")
      .eq("id", id)
      .single();

    const { data: template, error: templateError } = templateResult as {
      data: InvoiceTemplateRow | null;
      error: any;
    };

    if (templateError || !template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const response: TemplateDetailResponse = {
      template,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/invoice-templates/[id]
 * Update template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const { id } = params;
    const formData = await request.formData();

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Check if template exists
    const existingResult = await typedTable("invoice_templates")
      .select("id, type, template_file_url")
      .eq("id", id)
      .single();
    const { data: existing } = existingResult as {
      data: Pick<
        InvoiceTemplateRow,
        "id" | "type" | "template_file_url"
      > | null;
      error: any;
    };

    if (!existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: InvoiceTemplateUpdate = {};
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const is_default = formData.get("is_default");
    const is_active = formData.get("is_active");
    const template_file = formData.get("template_file") as File | null;

    if (name) updateData.name = name;
    if (description !== null) updateData.description = description || null;
    if (is_default !== null) updateData.is_default = is_default === "true";
    if (is_active !== null) updateData.is_active = is_active !== "false";

    // Handle file upload if provided
    let template_file_url = existing.template_file_url;
    if (template_file) {
      const fileExt = template_file.name.split(".").pop();
      const fileName = `invoice-templates/${
        existing.type
      }/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
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

      template_file_url = publicUrl;
      updateData.template_file_url = publicUrl;

      // Delete old file (optional - you might want to keep it for history)
      // Extract file path from old URL and delete it
      try {
        const oldFilePath = existing.template_file_url
          .split("/")
          .slice(-2)
          .join("/");
        await supabaseAdmin.storage.from("documents").remove([oldFilePath]);
      } catch (deleteError) {
        // Non-fatal, continue
        console.warn("Error deleting old template file:", deleteError);
      }
    }

    // If setting as default, unset other defaults of the same type
    if (updateData.is_default === true) {
      await typedTable("invoice_templates")
        .update({ is_default: false })
        .eq("type", existing.type)
        .eq("is_default", true)
        .neq("id", id);
    }

    // Update template
    const updateResult = await typedUpdate("invoice_templates", updateData)
      .eq("id", id)
      .select()
      .single();
    const { data: updatedTemplate, error: updateError } = updateResult as {
      data: InvoiceTemplateRow | null;
      error: any;
    };

    if (updateError) {
      console.error("Error updating template:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const response: UpdateTemplateResponse = {
      template: updatedTemplate!,
      message: "Template updated successfully",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/invoice-templates/[id]
 * Delete template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Get template to delete file
    const templateResult = await typedTable("invoice_templates")
      .select("id, template_file_url")
      .eq("id", id)
      .single();
    const { data: template } = templateResult as {
      data: Pick<InvoiceTemplateRow, "id" | "template_file_url"> | null;
      error: any;
    };

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Delete template file from storage
    try {
      const filePath = template.template_file_url
        .split("/")
        .slice(-2)
        .join("/");
      await supabaseAdmin.storage.from("documents").remove([filePath]);
    } catch (deleteError) {
      // Non-fatal, continue with template deletion
      console.warn("Error deleting template file:", deleteError);
    }

    // Delete template record
    const deleteResult = await typedTable("invoice_templates")
      .delete()
      .eq("id", id);

    const { error: deleteError } = deleteResult as { error: any };

    if (deleteError) {
      console.error("Error deleting template:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const response: DeleteTemplateResponse = {
      message: "Template deleted successfully",
      deleted: true,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
