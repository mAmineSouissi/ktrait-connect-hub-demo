import type { Partner } from "@/types/partner.types";

const API_BASE = "/api/client/partners";

/**
 * Client-side API functions for partner management (read-only for selection)
 */

export interface PartnerListResponse {
  partners: Partner[];
  total: number;
}

export const partners = {
  /**
   * List all partners (for selection when adding to projects)
   */
  async list(params?: {
    search?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PartnerListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch partners");
    }

    return response.json();
  },
};

