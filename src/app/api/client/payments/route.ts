import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  PaymentRow,
  PaymentInsert,
} from "@/types/supabase-database.types";

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
 * GET /api/client/payments
 * List payments for the current client (optionally filtered by project_id)
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
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortKey = searchParams.get("sortKey") || "date";
    const order = searchParams.get("order") || "desc";

    // Build query with project name join
    let query = typedTable("payments")
      .select(
        `
        *,
        project:projects!payments_project_id_fkey (
          id,
          name
        )
        `,
        { count: "exact" }
      )
      .eq("client_id", clientId); // Only payments for this client

    // Apply filters
    if (project_id) {
      // Verify project belongs to this client
      const projectCheck = await typedTable("projects")
        .select("id, client_id")
        .eq("id", project_id)
        .eq("client_id", clientId)
        .single();
      
      const { data: projectExists } = projectCheck as {
        data: { id: string; client_id: string } | null;
        error: any;
      };

      if (projectExists) {
        query = query.eq("project_id", project_id);
      }
    }
    if (status) {
      query = query.eq("status", status as string);
    }
    if (search) {
      query = query.or(
        `description.ilike.%${search}%,reference.ilike.%${search}%,payment_method.ilike.%${search}%`
      );
    }

    // Apply sorting
    const ascending = order === "asc" || order === "ASC";
    query = query.order(sortKey, { ascending });

    const result = await query.range(offset, offset + limit - 1);

    const {
      data: payments,
      error,
      count,
    } = result as {
      data: any[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format payments with project name
    const formattedPayments = (payments || []).map((payment: any) => ({
      ...payment,
      project_name: payment.project?.name || null,
    }));

    return NextResponse.json({
      payments: formattedPayments,
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
 * POST /api/client/payments
 * Create a new payment (only for current client's projects)
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
      status = "en_attente",
      payment_method,
      reference,
    } = body;

    // Validate required fields
    if (!date || !amount) {
      return NextResponse.json(
        {
          error: "date and amount are required",
        },
        { status: 400 }
      );
    }

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
        return NextResponse.json(
          { error: "Project not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Create payment with proper typing
    const paymentData: PaymentInsert = {
      client_id: clientId, // Automatically set to current client
      project_id: project_id || null,
      date,
      amount: parseFloat(amount.toString()),
      description: description || null,
      status,
      payment_method: payment_method || null,
      reference: reference || null,
    };

    const result = await typedInsert("payments", paymentData).select().single();

    const { data: payment, error } = result as {
      data: PaymentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        payment,
        message: "Payment created successfully",
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

