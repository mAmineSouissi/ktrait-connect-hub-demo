import type {
  InvoiceListResponse,
  InvoiceDetailResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  DeleteInvoiceResponse,
} from "@/types/invoice.types";

const API_BASE = "/api/admin/invoices";

/**
 * Client-side API functions for invoice management
 */
export const invoices = {
  /**
   * List invoices with filters and pagination
   */
  async list(params?: {
    type?: "devis" | "facture";
    client_id?: string;
    project_id?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<InvoiceListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.client_id) queryParams.append("client_id", params.client_id);
    if (params?.project_id) queryParams.append("project_id", params.project_id);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));
    if (params?.sortKey) queryParams.append("sortKey", params.sortKey);
    if (params?.order) queryParams.append("order", params.order);

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch invoices");
    }

    return response.json();
  },

  /**
   * Get invoice details by ID
   */
  async getById(id: string): Promise<InvoiceDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch invoice");
    }

    return response.json();
  },

  /**
   * Create a new invoice
   */
  async create(data: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create invoice");
    }

    return response.json();
  },

  /**
   * Update an invoice
   */
  async update({
    id,
    data,
  }: {
    id: string;
    data: UpdateInvoiceRequest;
  }): Promise<UpdateInvoiceResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update invoice");
    }

    return response.json();
  },

  /**
   * Delete an invoice
   */
  async delete(id: string, hard = false): Promise<DeleteInvoiceResponse> {
    const url = `${API_BASE}/${id}${hard ? "?hard=true" : ""}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete invoice");
    }

    return response.json();
  },
};
