import type { Payment, PaymentWithDetails } from "@/types/payment.types";

const API_BASE = "/api/admin/payments";

/**
 * Client-side API functions for payment management
 */

export interface PaymentListResponse {
  payments: PaymentWithDetails[];
  total: number;
}

export interface CreatePaymentRequest {
  client_id: string;
  project_id?: string;
  date: string;
  amount: number | string;
  description?: string;
  status?: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string;
  reference?: string;
}

export interface UpdatePaymentRequest {
  date?: string;
  amount?: number | string;
  description?: string;
  status?: "en_attente" | "payé" | "partiel" | "annulé";
  payment_method?: string;
  reference?: string;
  project_id?: string | null;
}

export interface CreatePaymentResponse {
  payment: Payment;
  message?: string;
}

export interface UpdatePaymentResponse {
  payment: Payment;
  message?: string;
}

export interface DeletePaymentResponse {
  message: string;
  deleted: boolean;
}

export const payments = {
  /**
   * List all payments with filters
   */
  async list(params?: {
    client_id?: string;
    project_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaymentListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.client_id) queryParams.append("client_id", params.client_id);
    if (params?.project_id) queryParams.append("project_id", params.project_id);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch payments");
    }

    return response.json();
  },

  /**
   * Get payment details by ID
   */
  async getById(id: string): Promise<{ payment: Payment }> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch payment");
    }

    return response.json();
  },

  /**
   * Create a new payment
   */
  async create(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create payment");
    }

    return response.json();
  },

  /**
   * Update payment by ID
   */
  async update(
    id: string,
    data: UpdatePaymentRequest
  ): Promise<UpdatePaymentResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update payment");
    }

    return response.json();
  },

  /**
   * Delete payment by ID
   */
  async delete(id: string): Promise<DeletePaymentResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete payment");
    }

    return response.json();
  },
};
