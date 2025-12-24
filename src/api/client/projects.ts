import type { Project, ProjectWithDetails } from "@/types/project.types";
import type { ProjectCategoryType } from "@/types/enums/project-category.enum";
import type { ProjectTypeType } from "@/types/enums/project-type.enum";

const API_BASE = "/api/client/projects";

/**
 * Client-side API functions for project management
 */

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: "planifié" | "en_cours" | "en_attente" | "terminé" | "annulé";
  estimated_budget?: number | string;
  start_date?: string;
  end_date?: string;
  address?: string;
  category?: ProjectCategoryType;
  type?: ProjectTypeType;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: "planifié" | "en_cours" | "en_attente" | "terminé" | "annulé";
  progress?: number;
  estimated_budget?: number | string;
  start_date?: string;
  end_date?: string;
  address?: string;
  category?: ProjectCategoryType;
  type?: ProjectTypeType;
}

export interface CreateProjectResponse {
  project: Project;
  message?: string;
}

export interface UpdateProjectResponse {
  project: Project;
  message?: string;
}

export interface ProjectPartnersListResponse {
  partners: Array<{
    id: string;
    project_id: string;
    partner_id: string;
    role: string | null;
    is_primary: boolean;
    created_at: string;
    partner: {
      id: string;
      name: string;
      type: string;
      contact_person: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
      status: string | null;
    } | null;
  }>;
}

export interface AddPartnerRequest {
  partner_id: string;
  role?: string;
  is_primary?: boolean;
}

export interface UpdatePartnerRequest {
  role?: string;
  is_primary?: boolean;
}

export const projects = {
  /**
   * List projects for the current client
   */
  async list(params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
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
      throw new Error(error.error || "Failed to fetch projects");
    }

    return response.json();
  },

  /**
   * Get project details by ID (for current client only)
   */
  async getById(id: string): Promise<{ project: ProjectWithDetails & { chantiers?: any[] } }> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch project");
    }

    return response.json();
  },

  /**
   * Create a new project (client_id is automatically set)
   */
  async create(data: CreateProjectRequest): Promise<CreateProjectResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create project");
    }

    return response.json();
  },

  /**
   * Update project by ID (only if it belongs to current client)
   */
  async update(
    id: string,
    data: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project");
    }

    return response.json();
  },

  /**
   * List partners for a project
   */
  async listPartners(projectId: string): Promise<ProjectPartnersListResponse> {
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
  async addPartner(
    projectId: string,
    data: AddPartnerRequest
  ): Promise<{ projectPartner: any; message?: string }> {
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
  async updatePartner(
    projectId: string,
    partnerId: string,
    data: UpdatePartnerRequest
  ): Promise<{ projectPartner: any; message?: string }> {
    const response = await fetch(`${API_BASE}/${projectId}/partners/${partnerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project partner");
    }

    return response.json();
  },

  /**
   * Remove partner from project
   */
  async removePartner(
    projectId: string,
    partnerId: string
  ): Promise<{ message: string; deleted: boolean }> {
    const response = await fetch(`${API_BASE}/${projectId}/partners/${partnerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to remove partner from project");
    }

    return response.json();
  },
};
