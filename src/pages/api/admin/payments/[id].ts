import type { NextApiRequest, NextApiResponse } from "next";
import { typedTable, typedUpdate } from "@/lib/supabase/typed-client";
import { createApiRouteClient } from "@/lib/supabase/api-route-client";
import type { Payment } from "@/types/payment.types";
import type {
  PaymentRow,
  PaymentUpdate,
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
 * GET /api/admin/payments/[id]
 * Get payment details
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const result = await typedTable("payments")
      .select("*")
      .eq("id", id)
      .single();

    const { data: payment, error } = result as {
      data: PaymentRow | null;
      error: any;
    };

    if (error || !payment) {
      console.error("Error fetching payment:", error);
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json({ payment });
  } catch (error: any) {
    console.error("Error in handleGet:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PUT /api/admin/payments/[id]
 * Update payment
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const {
      date,
      amount,
      description,
      status,
      payment_method,
      reference,
      project_id,
    } = req.body;

    // Build update object with proper typing
    const updateData: PaymentUpdate = {};
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (payment_method !== undefined)
      updateData.payment_method = payment_method;
    if (reference !== undefined) updateData.reference = reference;
    if (project_id !== undefined) updateData.project_id = project_id || null;

    const result = await typedUpdate("payments", updateData)
      .eq("id", id)
      .select()
      .single();

    const { data: payment, error } = result as {
      data: PaymentRow | null;
      error: any;
    };

    if (error) {
      console.error("Error updating payment:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      payment,
      message: "Payment updated successfully",
    });
  } catch (error: any) {
    console.error("Error in handlePut:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * DELETE /api/admin/payments/[id]
 * Delete payment
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const admin = await isAdmin(req, res);
  if (!admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const { error } = await typedTable("payments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting payment:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Payment deleted successfully",
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
