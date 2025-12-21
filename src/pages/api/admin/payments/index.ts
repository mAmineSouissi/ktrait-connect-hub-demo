import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedInsert } from "@/lib/supabase/typed-client";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { Payment } from "@/types/payment.types";
import type {
  PaymentRow,
  PaymentInsert,
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
 * GET /api/admin/payments
 * List all payments with filters
 * Query params: client_id, project_id, status, limit, offset
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const {
      client_id,
      project_id,
      status,
      limit = "100",
      offset = "0",
    } = req.query;

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
      return res.status(500).json({ error: error.message });
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

    return res.status(200).json({
      payments: paymentsWithDetails,
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
 * POST /api/admin/payments
 * Create a new payment
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const {
      client_id,
      project_id,
      date,
      amount,
      description,
      status = "en_attente",
      payment_method,
      reference,
    } = req.body;

    // Validate required fields
    if (!client_id || !date || !amount) {
      return res.status(400).json({
        error: "client_id, date, and amount are required",
      });
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
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      payment,
      message: "Payment created successfully",
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
