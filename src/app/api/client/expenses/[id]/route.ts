import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ExpenseRow, ExpenseUpdate } from "@/types/supabase-database.types";

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
 * Verify expense belongs to client's project
 */
async function verifyExpenseOwnership(
  expenseId: string,
  clientId: string
): Promise<boolean> {
  const expenseResult = await typedTable("expenses")
    .select("project_id, project:projects!expenses_project_id_fkey(client_id)")
    .eq("id", expenseId)
    .single();

  const { data: expense } = expenseResult as {
    data: { project_id: string; project?: { client_id: string } } | null;
    error: any;
  };

  if (!expense || !expense.project) {
    return false;
  }

  return expense.project.client_id === clientId;
}

/**
 * GET /api/client/expenses/[id]
 * Get expense details (only if it belongs to current client's project)
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
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyExpenseOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
    }

    const result = await typedTable("expenses")
      .select("*")
      .eq("id", id)
      .single();

    const { data: expense, error } = result as {
      data: ExpenseRow | null;
      error: any;
    };

    if (error || !expense) {
      console.error("Error fetching expense:", error);
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ expense });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/expenses/[id]
 * Update expense (only if it belongs to current client's project)
 */
export async function PUT(
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
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyExpenseOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { date, amount, description, category, supplier, invoice_number } =
      body;

    // Build update object
    const updateData: ExpenseUpdate = {};
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = parseFloat(amount.toString());
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category || null;
    if (supplier !== undefined) updateData.supplier = supplier || null;
    if (invoice_number !== undefined)
      updateData.invoice_number = invoice_number || null;

    const result = await typedUpdate("expenses", updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: expense, error } = result as {
      data: ExpenseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating expense:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      expense,
      message: "Expense updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/client/expenses/[id]
 * Delete expense (only if it belongs to current client's project)
 */
export async function DELETE(
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
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const isOwner = await verifyExpenseOwnership(id, clientId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await typedTable("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Expense deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

