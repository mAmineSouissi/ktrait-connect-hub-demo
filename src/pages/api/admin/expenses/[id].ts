import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { Expense } from "@/types/expense.types";
import type {
  ExpenseRow,
  ExpenseUpdate,
} from "@/types/supabase-database.types";

/**
 * Check if the current user is an admin
 */
async function isAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const supabase = createApiRouteClient(req, res);
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
 * GET /api/admin/expenses/[id]
 * Get expense details
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Expense ID is required" });
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
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.status(200).json({ expense });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/expenses/[id]
 * Update expense
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Expense ID is required" });
    }

    const { date, amount, description, category, supplier, invoice_number } =
      req.body;

    // Build update object with proper typing
    const updateData: ExpenseUpdate = {};
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
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
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      expense,
      message: "Expense updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/expenses/[id]
 * Delete expense
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Expense ID is required" });
    }

    const { error } = await typedTable("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      deleted: true,
    });
  } catch (error: any) {
    console.error("Error in handleDelete:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  }
  if (req.method === "PUT") {
    return handlePut(req, res);
  }
  if (req.method === "DELETE") {
    return handleDelete(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
