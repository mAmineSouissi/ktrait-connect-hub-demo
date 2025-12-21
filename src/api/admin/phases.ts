import type { ProjectPhase } from "@/types/project.types";

const API_BASE = "/api/admin/projects";

/**
 * Client-side API functions for project phase management
 */

export interface CreatePhaseRequest {
  name: string;
  description?: string;
  status?: "à_venir" | "en_cours" | "terminé" | "bloqué";
  progress_percentage?: number;
  order_index?: number;
}

export interface UpdatePhaseRequest {
  name?: string;
  description?: string;
  status?: "à_venir" | "en_cours" | "terminé" | "bloqué";
  progress_percentage?: number;
  order_index?: number;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface CreatePhaseResponse {
  phase: ProjectPhase;
  message?: string;
}

export interface UpdatePhaseResponse {
  phase: ProjectPhase;
  message?: string;
}

export interface DeletePhaseResponse {
  message: string;
  deleted: boolean;
}

export interface GetPhaseResponse {
  phase: ProjectPhase;
}

export const phases = {
  /**
   * List all phases for a project
   */
  async list(projectId: string): Promise<{ phases: ProjectPhase[] }> {
    const response = await fetch(`${API_BASE}/${projectId}/phases`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch phases");
    }

    return response.json();
  },

  /**
   * Get a single phase by ID
   */
  async getById(projectId: string, phaseId: string): Promise<GetPhaseResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/phases/${phaseId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch phase");
    }

    return response.json();
  },

  /**
   * Create a new phase for a project
   */
  async create(
    projectId: string,
    data: CreatePhaseRequest
  ): Promise<CreatePhaseResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/phases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create phase");
    }

    return response.json();
  },

  /**
   * Update phase by ID
   */
  async update(
    projectId: string,
    phaseId: string,
    data: UpdatePhaseRequest
  ): Promise<UpdatePhaseResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/phases/${phaseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update phase");
    }

    return response.json();
  },

  /**
   * Delete phase by ID
   */
  async delete(
    projectId: string,
    phaseId: string
  ): Promise<DeletePhaseResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/phases/${phaseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete phase");
    }

    return response.json();
  },
};
