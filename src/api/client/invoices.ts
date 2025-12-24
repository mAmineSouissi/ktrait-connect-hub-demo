import type {
  InvoiceListResponse,
  InvoiceDetailResponse,
} from "@/types/invoice.types";

const API_BASE = "/api/client/invoices";

/**
 * Client-side API functions for invoice management (read-only)
 */
export const invoices = {
  /**
   * List invoices for current client with filters and pagination
   */
  async list(params?: {
    type?: "devis" | "facture";
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
   * Get invoice details by ID (for current client only)
   */
  async getById(id: string): Promise<InvoiceDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch invoice");
    }

    return response.json();
  },
};

