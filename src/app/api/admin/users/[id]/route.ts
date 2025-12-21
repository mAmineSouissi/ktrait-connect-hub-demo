import { NextRequest, NextResponse } from "next/server";
import {
  typedTable,
  typedUpdate,
  typedInsert,
} from "@/lib/supabase/typed-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  UpdateUserRequest,
  UserDetailResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "@/types/user-management.types";
import type {
  UserRow,
  UserUpdate,
  ProjectRow,
  DocumentRow,
  PaymentRow,
  ClientRow,
  ClientInsert,
} from "@/types/supabase-database.types";

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
 * GET /api/admin/users/[id]
 * Get user details with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin access
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Get user
    const userResult = await typedTable("users")
      .select("*")
      .eq("id", id)
      .single();
    const { data: user, error: userError } = userResult as {
      data: UserRow | null;
      error: any;
    };

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent accessing admin users
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot access admin user details" },
        { status: 403 }
      );
    }

    // Get project count
    const projectsCountResult = await typedTable("projects")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id);
    const { count: projectsCount } = projectsCountResult as {
      count: number | null;
      error: any;
    };

    // Get projects list for client
    const projectsResult = await typedTable("projects")
      .select("id, name, status, progress, estimated_budget")
      .eq("client_id", id)
      .order("created_at", { ascending: false });
    const { data: projects } = projectsResult as {
      data:
        | Pick<
            ProjectRow,
            "id" | "name" | "status" | "progress" | "estimated_budget"
          >[]
        | null;
      error: any;
    };

    // Get client-specific data if role is client
    let clientData: Partial<ClientRow> = {};
    if (user.role === "client") {
      const clientResult = await typedTable("clients")
        .select("city, address, postal_code, company_name, tax_id")
        .eq("user_id", id)
        .single();
      const { data: client } = clientResult as {
        data: Pick<
          ClientRow,
          "city" | "address" | "postal_code" | "company_name" | "tax_id"
        > | null;
        error: any;
      };

      if (client) {
        clientData = client;
      }
    }

    // Format projects for display
    const formattedProjects = (projects || []).map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      progress: project.progress || 0,
      budget: project.estimated_budget
        ? new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(project.estimated_budget)
        : "N/A",
    }));

    // Get documents for client
    const documentsResult = await typedTable("documents")
      .select("id, name, file_type, uploaded_at, status")
      .eq("client_id", id)
      .order("uploaded_at", { ascending: false });
    const { data: documents } = documentsResult as {
      data:
        | Pick<
            DocumentRow,
            "id" | "name" | "file_type" | "uploaded_at" | "status"
          >[]
        | null;
      error: any;
    };

    const formattedDocuments = (documents || []).map((doc) => ({
      id: doc.id,
      name: doc.name,
      type: doc.file_type || "N/A",
      date: doc.uploaded_at
        ? new Date(doc.uploaded_at).toLocaleDateString("fr-FR")
        : "N/A",
      status: doc.status,
    }));

    const paymentsResult = await typedTable("payments")
      .select("id, date, amount, status, description")
      .eq("client_id", id)
      .order("date", { ascending: false });
    const { data: payments } = paymentsResult as {
      data:
        | Pick<
            PaymentRow,
            "id" | "date" | "amount" | "status" | "description"
          >[]
        | null;
      error: any;
    };

    // Format payments for display
    const formattedPayments = (payments || []).map((payment) => ({
      id: payment.id,
      date: payment.date
        ? new Date(payment.date).toLocaleDateString("fr-FR")
        : "N/A",
      amount: payment.amount
        ? new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(payment.amount)
        : "N/A",
      status: payment.status === "payé" ? "Payé" : "En attente",
      description: payment.description || "",
    }));

    const response: UserDetailResponse = {
      user: {
        ...user,
        ...clientData,
        projects_count: projectsCount || 0,
        projects: formattedProjects,
        documents: formattedDocuments,
        payments: formattedPayments,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update user information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin access
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { id } = params;
  const data: UpdateUserRequest = await request.json();

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Check if user exists and is not admin
    const existingUserResult = await typedTable("users")
      .select("id, role, email")
      .eq("id", id)
      .single();
    const { data: existingUser, error: checkError } = existingUserResult as {
      data: Pick<UserRow, "id" | "role" | "email"> | null;
      error: any;
    };

    if (checkError || !existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.role === "admin") {
      return NextResponse.json(
        { error: "Cannot update admin users via this endpoint" },
        { status: 403 }
      );
    }

    // Get current admin user ID for approved_by tracking
    const supabaseClient = await createAppRouteClient();
    const {
      data: { user: currentAdmin },
    } = await supabaseClient.auth.getUser();
    const adminUserId = currentAdmin?.id;

    // Prepare update data for users table with proper typing
    const userUpdateData: UserUpdate = {};
    if (data.full_name !== undefined) userUpdateData.full_name = data.full_name;
    if (data.phone !== undefined) userUpdateData.phone = data.phone;
    if (data.email !== undefined) userUpdateData.email = data.email;
    if (data.role !== undefined) userUpdateData.role = data.role;
    if (data.is_active !== undefined) userUpdateData.is_active = data.is_active;
    if (data.email_verified !== undefined)
      userUpdateData.email_verified = data.email_verified;
    if (data.approval_status !== undefined) {
      userUpdateData.approval_status = data.approval_status as any;
      // Set approved_at and approved_by when approving
      if (data.approval_status === "approved" && adminUserId) {
        userUpdateData.approved_at = new Date().toISOString();
        userUpdateData.approved_by = adminUserId;
      }
      // Clear approval data when rejecting or setting to pending
      if (
        data.approval_status === "rejected" ||
        data.approval_status === "pending"
      ) {
        userUpdateData.approved_at = null;
        userUpdateData.approved_by = null;
      }
    }
    if (data.rejection_reason !== undefined) {
      userUpdateData.rejection_reason = data.rejection_reason;
    }

    // Update user
    const updatedUserResult = await typedUpdate("users", userUpdateData)
      .eq("id", id)
      .select()
      .single();
    const { data: updatedUser, error: updateError } = updatedUserResult as {
      data: UserRow | null;
      error: any;
    };

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update email in auth if changed (need admin client for auth operations)
    if (data.email && data.email !== existingUser.email) {
      const { error: authUpdateError } = await (
        (supabase as any).auth.admin as any
      ).updateUserById(id, {
        email: data.email,
      });

      if (authUpdateError) {
        console.error("Error updating auth email:", authUpdateError);
        // Non-fatal, continue
      }
    }

    // Update client profile if role is client
    if (updatedUser?.role === "client") {
      const clientUpdateData: Partial<ClientRow> = {};
      if (data.city !== undefined) clientUpdateData.city = data.city;
      if (data.address !== undefined) clientUpdateData.address = data.address;
      if (data.postal_code !== undefined)
        clientUpdateData.postal_code = data.postal_code;
      if (data.company_name !== undefined)
        clientUpdateData.company_name = data.company_name;
      if (data.tax_id !== undefined) clientUpdateData.tax_id = data.tax_id;

      // Check if client profile exists
      const existingClientResult = await typedTable("clients")
        .select("id")
        .eq("user_id", id)
        .single();
      const { data: existingClient } = existingClientResult as {
        data: Pick<ClientRow, "id"> | null;
        error: any;
      };

      if (existingClient) {
        // Update existing client profile
        await typedUpdate("clients", clientUpdateData).eq("user_id", id);
      } else {
        // Create client profile if it doesn't exist
        const clientInsertData: ClientInsert = {
          user_id: id,
          ...clientUpdateData,
        };
        await typedInsert("clients", clientInsertData);
      }
    }

    // Get updated user with all data
    const finalUserResult = await typedTable("users")
      .select("*")
      .eq("id", id)
      .single();
    const { data: finalUser } = finalUserResult as {
      data: UserRow | null;
      error: any;
    };

    // Get project count
    const projectsCountResult = await typedTable("projects")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id);
    const { count: projectsCount } = projectsCountResult as {
      count: number | null;
      error: any;
    };

    // Get client data
    let clientData: Partial<ClientRow> = {};
    if (updatedUser?.role === "client") {
      const clientResult = await typedTable("clients")
        .select("city, address, postal_code, company_name, tax_id")
        .eq("user_id", id)
        .single();
      const { data: client } = clientResult as {
        data: Pick<
          ClientRow,
          "city" | "address" | "postal_code" | "company_name" | "tax_id"
        > | null;
        error: any;
      };

      if (client) {
        clientData = client;
      }
    }

    const response: UpdateUserResponse = {
      user: {
        ...(finalUser || updatedUser)!,
        ...clientData,
        projects_count: projectsCount || 0,
      } as any,
      message: "User updated successfully",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (soft delete by setting is_active to false, or hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin access
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { id } = params;
  const { searchParams } = request.nextUrl;
  const hard = searchParams.get("hard") || "false";

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Check if user exists and is not admin
    const existingUserResult = await typedTable("users")
      .select("id, role, email")
      .eq("id", id)
      .single();
    const { data: existingUser, error: checkError } = existingUserResult as {
      data: Pick<UserRow, "id" | "role" | "email"> | null;
      error: any;
    };

    if (checkError || !existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    // Need admin client for auth operations
    if (hard === "true") {
      // Hard delete: Delete from auth and cascade will handle users table
      const { error: deleteError } = await (
        supabase.auth.admin as any
      ).deleteUser(id);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }

      const response: DeleteUserResponse = {
        message: "User permanently deleted",
        deleted: true,
      };

      return NextResponse.json(response);
    } else {
      // Soft delete: Set is_active to false
      const { error: updateError } = await typedUpdate("users", {
        is_active: false,
      }).eq("id", id);

      if (updateError) {
        console.error("Error deactivating user:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const response: DeleteUserResponse = {
        message: "User deactivated successfully",
        deleted: false,
      };

      return NextResponse.json(response);
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
