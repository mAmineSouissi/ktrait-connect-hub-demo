import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type {
  ExpenseRow,
  ExpenseInsert,
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
 * GET /api/admin/expenses
 * List all expenses with filters
 * Query params: project_id, category, limit, offset
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { project_id, category, limit = "100", offset = "0" } = req.query;

    let query = typedTable("expenses")
      .select("*", { count: "exact" })
      .order("date", { ascending: false });

    // Apply filters
    if (project_id) {
      query = query.eq("project_id", project_id as string);
    }
    if (category) {
      query = query.eq("category", category as string);
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: expenses,
      error,
      count,
    } = result as {
      data: ExpenseRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ error: error.message });
    }

    // Get project names
    const expensesWithDetails = await Promise.all(
      (expenses || []).map(async (expense: ExpenseRow) => {
        const details: { project_name?: string | null } = {};

        if (expense.project_id) {
          const projectResult = await typedTable("projects")
            .select("name")
            .eq("id", expense.project_id)
            .single();
          const { data: project } = projectResult as {
            data: { name: string } | null;
            error: any;
          };
          details.project_name = project?.name || null;
        }

        return { ...expense, ...details };
      })
    );

    return res.status(200).json({
      expenses: expensesWithDetails,
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * POST /api/admin/expenses
 * Create a new expense
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const {
      project_id,
      date,
      amount,
      description,
      category,
      supplier,
      invoice_number,
    } = req.body;

    // Validate required fields
    if (!project_id || !date || !amount || !description) {
      return res.status(400).json({
        error: "project_id, date, amount, and description are required",
      });
    }

    // Create expense with proper typing
    const expenseData: ExpenseInsert = {
      project_id,
      date,
      amount: parseFloat(amount),
      description,
      category: category || null,
      supplier: supplier || null,
      invoice_number: invoice_number || null,
    };

    const result = await typedInsert("expenses", expenseData).select().single();

    const { data: expense, error } = result as {
      data: ExpenseRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      expense,
      message: "Expense created successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePost:", error);
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
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
