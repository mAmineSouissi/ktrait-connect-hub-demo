import type { ProjectPartner } from "@/types/project.types";
import type { Partner } from "@/types/partner.types";

const API_BASE = "/api/admin/projects";

/**
 * Client-side API functions for project partner management
 */

export interface ProjectPartnerWithDetails {
  id: string;
  project_id: string;
  partner_id: string;
  role?: string | null;
  is_primary: boolean;
  created_at: string;
  partner: Partner | null;
}

export interface AddProjectPartnerRequest {
  partner_id: string;
  role?: string;
  is_primary?: boolean;
}

export interface UpdateProjectPartnerRequest {
  role?: string | null;
  is_primary?: boolean;
}

export interface AddProjectPartnerResponse {
  projectPartner: ProjectPartnerWithDetails;
  message?: string;
}

export interface UpdateProjectPartnerResponse {
  projectPartner: ProjectPartnerWithDetails;
  message?: string;
}

export interface DeleteProjectPartnerResponse {
  message: string;
  deleted: boolean;
}

export interface ListProjectPartnersResponse {
  partners: ProjectPartnerWithDetails[];
}

export const projectPartners = {
  /**
   * List all partners for a project
   */
  async list(projectId: string): Promise<ListProjectPartnersResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/partners`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch project partners");
    }

    return response.json();
  },

  /**
   * Add a partner to a project
   */
  async add(
    projectId: string,
    data: AddProjectPartnerRequest
  ): Promise<AddProjectPartnerResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/partners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add partner to project");
    }

    return response.json();
  },

  /**
   * Update project partner relationship
   */
  async update(
    projectId: string,
    partnerId: string,
    data: UpdateProjectPartnerRequest
  ): Promise<UpdateProjectPartnerResponse> {
    const response = await fetch(
      `${API_BASE}/${projectId}/partners/${partnerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project partner");
    }

    return response.json();
  },

  /**
   * Remove partner from project
   */
  async remove(
    projectId: string,
    partnerId: string
  ): Promise<DeleteProjectPartnerResponse> {
    const response = await fetch(
      `${API_BASE}/${projectId}/partners/${partnerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to remove partner from project");
    }

    return response.json();
  },
};
