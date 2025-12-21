import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  ExpenseRow,
  ExpenseInsert,
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
 * GET /api/admin/expenses
 * List all expenses with filters
 * Query params: project_id, category, limit, offset
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
    const project_id = searchParams.get("project_id");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

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
      return NextResponse.json({ error: error.message }, { status: 500 });
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

    return NextResponse.json({
      expenses: expensesWithDetails,
      total: count || 0,
    });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/expenses
 * Create a new expense
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
    const body = await request.json();
    const {
      project_id,
      date,
      amount,
      description,
      category,
      supplier,
      invoice_number,
    } = body;

    // Validate required fields
    if (!project_id || !date || !amount || !description) {
      return NextResponse.json(
        {
          error: "project_id, date, amount, and description are required",
        },
        { status: 400 }
      );
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        expense,
        message: "Expense created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
