import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type {
  PaymentRow,
  PaymentUpdate,
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
 * GET /api/client/payments/[id]
 * Get payment details (only if it belongs to current client)
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
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const result = await typedTable("payments")
      .select("*")
      .eq("id", id)
      .eq("client_id", clientId) // Ensure payment belongs to this client
      .single();

    const { data: payment, error } = result as {
      data: PaymentRow | null;
      error: any;
    };

    if (error || !payment) {
      console.error("Error fetching payment:", error);
      return NextResponse.json(
        { error: "Payment not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ payment });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/payments/[id]
 * Update payment (only if it belongs to current client)
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
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Verify payment belongs to this client
    const paymentCheck = await typedTable("payments")
      .select("id, client_id, project_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: paymentExists } = paymentCheck as {
      data: { id: string; client_id: string; project_id?: string | null } | null;
      error: any;
    };

    if (!paymentExists) {
      return NextResponse.json(
        { error: "Payment not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      date,
      amount,
      description,
      status,
      payment_method,
      reference,
      project_id,
    } = body;

    // If project_id is being updated, verify it belongs to this client
    if (project_id !== undefined && project_id !== null) {
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

    // Build update object
    const updateData: PaymentUpdate = {};
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = parseFloat(amount.toString());
    if (description !== undefined) updateData.description = description || null;
    if (status !== undefined) updateData.status = status;
    if (payment_method !== undefined) updateData.payment_method = payment_method || null;
    if (reference !== undefined) updateData.reference = reference || null;
    if (project_id !== undefined) updateData.project_id = project_id || null;

    const result = await typedUpdate("payments", updateData)
      .eq("id", id)
      .eq("client_id", clientId) // Double-check ownership
      .select()
      .single();

    const { data: payment, error } = result as {
      data: PaymentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating payment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      payment,
      message: "Payment updated successfully",
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
 * DELETE /api/client/payments/[id]
 * Delete payment (only if it belongs to current client)
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
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Verify payment belongs to this client before deleting
    const paymentCheck = await typedTable("payments")
      .select("id, client_id")
      .eq("id", id)
      .eq("client_id", clientId)
      .single();
    
    const { data: paymentExists } = paymentCheck as {
      data: { id: string; client_id: string } | null;
      error: any;
    };

    if (!paymentExists) {
      return NextResponse.json(
        { error: "Payment not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await typedTable("payments")
      .delete()
      .eq("id", id)
      .eq("client_id", clientId); // Double-check ownership

    if (error) {
      console.error("Error deleting payment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Payment deleted successfully",
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

