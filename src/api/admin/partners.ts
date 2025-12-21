import type { Partner, PartnerWithDetails } from "@/types/partner.types";

const API_BASE = "/api/admin/partners";

export type PartnerType =
  | "architecte"
  | "bureau_études"
  | "maître_d_œuvre"
  | "artisan"
  | "fournisseur"
  | "autre";

/**
 * Client-side API functions for partner management
 */

export interface PartnerWithCounts extends Partner {
  projects_count?: number;
}

export interface CreatePartnerRequest {
  // User account fields (required)
  email: string;
  password: string;
  full_name: string;
  // Partner fields
  name: string;
  type: PartnerType;
  contact_person?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  status?: string;
  since_date?: string;
  notes?: string;
}

export interface UpdatePartnerRequest {
  name?: string;
  type?: PartnerType;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status?: string;
  since_date?: string | null;
  notes?: string | null;
}

export interface CreatePartnerResponse {
  partner: Partner;
  message?: string;
}

export interface UpdatePartnerResponse {
  partner: Partner;
  message?: string;
}

export interface DeletePartnerResponse {
  message: string;
  deleted: boolean;
}

export interface ListPartnersResponse {
  partners: PartnerWithCounts[];
  total: number;
}

export interface GetPartnerResponse {
  partner: PartnerWithDetails;
}

export const partners = {
  /**
   * List all partners
   */
  async list(params?: {
    search?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<ListPartnersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.sortKey) queryParams.append("sortKey", params.sortKey);
    if (params?.order) queryParams.append("order", params.order);

    const response = await fetch(
      `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch partners");
    }

    return response.json();
  },

  /**
   * Get partner by ID
   */
  async getById(id: string): Promise<GetPartnerResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch partner");
    }

    return response.json();
  },

  /**
   * Create a new partner
   */
  async create(data: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create partner");
    }

    return response.json();
  },

  /**
   * Update partner
   */
  async update(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<UpdatePartnerResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update partner");
    }

    return response.json();
  },

  /**
   * Delete partner
   */
  async delete(id: string): Promise<DeletePartnerResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete partner");
    }

    return response.json();
  },
};
