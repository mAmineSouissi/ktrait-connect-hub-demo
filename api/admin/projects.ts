import type { Project, ProjectWithDetails } from "@/types/project.types";

const API_BASE = "/api/admin/projects";

/**
 * Client-side API functions for project management
 */

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface CreateProjectRequest {
  client_id: string;
  name: string;
  description?: string;
  status?: "planifié" | "en_cours" | "en_attente" | "terminé" | "annulé";
  estimated_budget?: number | string;
  start_date?: string;
  end_date?: string;
  address?: string;
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
}

export interface CreateProjectResponse {
  project: Project;
  message?: string;
}

export interface UpdateProjectResponse {
  project: Project;
  message?: string;
}

export interface DeleteProjectResponse {
  message: string;
  deleted: boolean;
}

export const projects = {
  /**
   * List all projects with filters
   */
  async list(params?: {
    search?: string;
    client_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.client_id) queryParams.append("client_id", params.client_id);
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
   * Get project details by ID
   */
  async getById(id: string): Promise<{ project: ProjectWithDetails }> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch project");
    }

    return response.json();
  },

  /**
   * Create a new project
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
   * Update project by ID
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
   * Delete project by ID
   */
  async delete(id: string): Promise<DeleteProjectResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete project");
    }

    return response.json();
  },
};
