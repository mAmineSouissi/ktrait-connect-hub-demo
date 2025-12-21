import type { Expense, ExpenseWithDetails } from "@/types/expense.types";

const API_BASE = "/api/admin/expenses";

/**
 * Client-side API functions for expense management
 */

export interface ExpenseListResponse {
  expenses: ExpenseWithDetails[];
  total: number;
}

export interface CreateExpenseRequest {
  project_id: string;
  date: string;
  amount: number | string;
  description: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres";
  supplier?: string;
  invoice_number?: string;
}

export interface UpdateExpenseRequest {
  date?: string;
  amount?: number | string;
  description?: string;
  category?:
    | "fondations"
    | "gros_œuvre"
    | "second_œuvre"
    | "finitions"
    | "main_d_œuvre"
    | "matériaux"
    | "équipements"
    | "autres"
    | null;
  supplier?: string | null;
  invoice_number?: string | null;
}

export interface CreateExpenseResponse {
  expense: Expense;
  message?: string;
}

export interface UpdateExpenseResponse {
  expense: Expense;
  message?: string;
}

export interface DeleteExpenseResponse {
  message: string;
  deleted: boolean;
}

export const expenses = {
  /**
   * List all expenses with filters
   */
  async list(params?: {
    project_id?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ExpenseListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append("project_id", params.project_id);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch expenses");
    }

    return response.json();
  },

  /**
   * Get expense details by ID
   */
  async getById(id: string): Promise<{ expense: Expense }> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch expense");
    }

    return response.json();
  },

  /**
   * Create a new expense
   */
  async create(data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create expense");
    }

    return response.json();
  },

  /**
   * Update expense by ID
   */
  async update(
    id: string,
    data: UpdateExpenseRequest
  ): Promise<UpdateExpenseResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update expense");
    }

    return response.json();
  },

  /**
   * Delete expense by ID
   */
  async delete(id: string): Promise<DeleteExpenseResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete expense");
    }

    return response.json();
  },
};
