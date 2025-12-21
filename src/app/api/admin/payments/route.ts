import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { Payment } from "@/types/payment.types";
import type {
  PaymentRow,
  PaymentInsert,
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
 * GET /api/admin/payments
 * List all payments with filters
 * Query params: client_id, project_id, status, limit, offset
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
    const client_id = searchParams.get("client_id");
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    let query = typedTable("payments")
      .select("*", { count: "exact" })
      .order("date", { ascending: false });

    // Apply filters
    if (client_id) {
      query = query.eq("client_id", client_id as string);
    }
    if (project_id) {
      query = query.eq("project_id", project_id as string);
    }
    if (status) {
      query = query.eq("status", status as string);
    }

    const result = await query.range(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const {
      data: payments,
      error,
      count,
    } = result as {
      data: PaymentRow[] | null;
      error: any;
      count: number | null;
    };

    if (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get related data (client, project names)
    const paymentsWithDetails = await Promise.all(
      (payments || []).map(async (payment: PaymentRow) => {
        const details: {
          client_name?: string | null;
          project_name?: string | null;
        } = {};

        if (payment.client_id) {
          const clientResult = await typedTable("users")
            .select("full_name")
            .eq("id", payment.client_id)
            .single();
          const { data: client } = clientResult as {
            data: { full_name: string } | null;
            error: any;
          };
          details.client_name = client?.full_name || null;
        }

        if (payment.project_id) {
          const projectResult = await typedTable("projects")
            .select("name")
            .eq("id", payment.project_id)
            .single();
          const { data: project } = projectResult as {
            data: { name: string } | null;
            error: any;
          };
          details.project_name = project?.name || null;
        }

        return { ...payment, ...details };
      })
    );

    return NextResponse.json({
      payments: paymentsWithDetails,
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
 * POST /api/admin/payments
 * Create a new payment
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
      client_id,
      project_id,
      date,
      amount,
      description,
      status = "en_attente",
      payment_method,
      reference,
    } = body;

    // Validate required fields
    if (!client_id || !date || !amount) {
      return NextResponse.json(
        {
          error: "client_id, date, and amount are required",
        },
        { status: 400 }
      );
    }

    // Create payment with proper typing
    const paymentData: PaymentInsert = {
      client_id,
      project_id: project_id || null,
      date,
      amount: parseFloat(amount),
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
