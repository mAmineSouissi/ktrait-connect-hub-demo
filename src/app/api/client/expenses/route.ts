import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ExpenseRow, ExpenseInsert } from "@/types/supabase-database.types";

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
 * GET /api/client/expenses
 * List expenses for the current client's projects
 * Query params: project_id, category, limit, offset
 */
export async function GET(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const project_id = searchParams.get("project_id");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    // If project_id is provided, verify it belongs to this client
    if (project_id) {
      const projectCheck = await typedTable("projects")
        .select("id, client_id")
        .eq("id", project_id)
        .eq("client_id", clientId)
        .single();
      
      const { data: projectExists } = projectCheck as {
        data: { id: string; client_id: string } | null;
        error: any;
      };

      if (!projectExists) {
        // Project doesn't belong to client, return empty
        return NextResponse.json({
          expenses: [],
          total: 0,
        });
      }
    }

    // Get expenses for projects belonging to this client
    let query = typedTable("expenses")
      .select(
        `
        *,
        project:projects!expenses_project_id_fkey (
          id,
          name,
          client_id
        )
      `,
        { count: "exact" }
      )
      .order("date", { ascending: false });

    // Filter by project if provided (already verified above)
    if (project_id) {
      query = query.eq("project_id", project_id);
    } else {
      // If no project_id, filter by client's projects
      const clientProjects = await typedTable("projects")
        .select("id")
        .eq("client_id", clientId);
      
      const { data: projects } = clientProjects as {
        data: { id: string }[] | null;
        error: any;
      };

      if (projects && projects.length > 0) {
        const projectIds = projects.map((p) => p.id);
        query = query.in("project_id", projectIds);
      } else {
        // No projects, return empty
        return NextResponse.json({
          expenses: [],
          total: 0,
        });
      }
    }

    if (category) {
      query = query.eq("category", category);
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
      data: (ExpenseRow & { project?: { id: string; name: string; client_id: string } })[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching expenses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out any expenses that don't belong to client's projects (double-check)
    const filteredExpenses = (expenses || []).filter((expense) => {
      if (expense.project) {
        return expense.project.client_id === clientId;
      }
      return false;
    });

    const expensesWithDetails = filteredExpenses.map((expense) => ({
      ...expense,
      project_name: expense.project?.name || null,
    }));

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
 * POST /api/client/expenses
 * Create a new expense for the current client's project
 */
export async function POST(request: NextRequest) {
  const clientId = await getCurrentClientId();
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
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

    // Verify the project belongs to this client
    const projectCheck = await typedTable("projects")
      .select("id, client_id")
      .eq("id", project_id)
      .eq("client_id", clientId)
      .single();
    
    const { data: projectExists, error: projectError } = projectCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (projectError || !projectExists) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Create expense
    const expenseData: ExpenseInsert = {
      project_id,
      date,
      amount: parseFloat(amount.toString()),
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

