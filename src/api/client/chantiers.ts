import type {
  ChantierListResponse,
  ChantierDetailResponse,
  CreateChantierRequest,
  UpdateChantierRequest,
} from "@/types/chantier.types";

const API_BASE = "/api/client/chantiers";

/**
 * Client-side API functions for chantier management
 */

export const chantiers = {
  /**
   * List chantiers for the current client's projects
   */
  async list(params?: {
    project_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ChantierListResponse> {
    const queryParams = new URLSearchParams();
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
      throw new Error(error.error || "Failed to fetch chantiers");
    }

    return response.json();
  },

  /**
   * Get chantier details by ID (for current client only)
   */
  async getById(id: string): Promise<ChantierDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch chantier");
    }

    return response.json();
  },

  /**
   * Create a new chantier (project must belong to current client)
   */
  async create(
    data: CreateChantierRequest
  ): Promise<{ chantier: ChantierDetailResponse["chantier"] }> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create chantier");
    }

    return response.json();
  },

  /**
   * Update chantier by ID (only if it belongs to current client's project)
   */
  async update(
    id: string,
    data: UpdateChantierRequest
  ): Promise<{ chantier: ChantierDetailResponse["chantier"]; message?: string }> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update chantier");
    }

    return response.json();
  },

  /**
   * Delete chantier by ID (only if it belongs to current client's project)
   */
  async delete(id: string): Promise<{ message: string; deleted: boolean }> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete chantier");
    }

    return response.json();
  },
};

