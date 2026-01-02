/**
 * Client-side API functions for partner project management
 */

export interface PartnerProject {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  progress: number;
  estimated_budget?: number | null;
  spent_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  address?: string | null;
  category?: string | null;
  type?: string | null;
  created_at: string;
  updated_at: string;
  client_id: string;
  client_name?: string | null;
  client_email?: string | null;
  role?: string | null;
  is_primary: boolean;
  project_partner_id: string;
}

export interface PartnerProjectDetail extends PartnerProject {
  client: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
  } | null;
}

export interface ProjectListResponse {
  projects: PartnerProject[];
  total: number;
}

export interface ProjectDetailResponse {
  project: PartnerProjectDetail;
}

const API_BASE = "/api/partner/projects";

export const projects = {
  /**
   * List all projects assigned to current partner
   */
  async list(params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();
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
      throw new Error(error.error || "Failed to fetch projects");
    }

    return response.json();
  },

  /**
   * Get project details by ID (only if assigned to current partner)
   */
  async getById(id: string): Promise<ProjectDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch project");
    }

    return response.json();
  },

  /**
   * Get phases for a project (read-only)
   */
  async getPhases(projectId: string): Promise<{ phases: any[] }> {
    const response = await fetch(`${API_BASE}/${projectId}/phases`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch phases");
    }

    return response.json();
  },

  /**
   * Get documents for a project (read-only)
   */
  async getDocuments(projectId: string): Promise<{
    documents: any[];
    total: number;
  }> {
    const response = await fetch(`${API_BASE}/${projectId}/documents`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch documents");
    }

    return response.json();
  },

  /**
   * Get gallery items for a project (read-only)
   */
  async getGallery(projectId: string): Promise<{ gallery: any[] }> {
    const response = await fetch(`${API_BASE}/${projectId}/gallery`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch gallery");
    }

    return response.json();
  },

  /**
   * Get tasks for a project (read-only)
   */
  async getTasks(projectId: string): Promise<{ tasks: any[] }> {
    const response = await fetch(`${API_BASE}/${projectId}/tasks`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch tasks");
    }

    return response.json();
  },
};

/**
 * Client-side API functions for partner task management
 */
export interface PartnerTask {
  id: string;
  project_id: string;
  name: string;
  description?: string | null;
  status: "à_faire" | "en_cours" | "terminé" | "bloqué";
  priority: "faible" | "moyenne" | "élevée" | "urgente";
  assigned_to?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  completed_at?: string | null;
  progress: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export interface PartnerTaskListResponse {
  tasks: PartnerTask[];
  total: number;
}

export interface CreatePartnerTaskRequest {
  project_id: string;
  name: string;
  description?: string | null;
  status?: "à_faire" | "en_cours" | "terminé" | "bloqué";
  priority?: "faible" | "moyenne" | "élevée" | "urgente";
  assigned_to?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  progress?: number;
  order_index?: number;
}

export interface UpdatePartnerTaskRequest {
  name?: string;
  description?: string | null;
  status?: "à_faire" | "en_cours" | "terminé" | "bloqué";
  priority?: "faible" | "moyenne" | "élevée" | "urgente";
  assigned_to?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  progress?: number;
  order_index?: number;
  completed_at?: string | null;
}

export const tasks = {
  /**
   * List all tasks from projects assigned to current partner
   */
  async list(params?: {
    status?: string;
    priority?: string;
    project_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<PartnerTaskListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.project_id) queryParams.append("project_id", params.project_id);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const url = `/api/partner/tasks${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch tasks");
    }

    return response.json();
  },

  /**
   * Create a new task
   */
  async create(data: CreatePartnerTaskRequest): Promise<{ task: PartnerTask }> {
    const response = await fetch("/api/partner/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create task");
    }

    return response.json();
  },

  /**
   * Update a task
   */
  async update(
    taskId: string,
    data: UpdatePartnerTaskRequest
  ): Promise<{ task: PartnerTask }> {
    const response = await fetch(`/api/partner/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update task");
    }

    return response.json();
  },

  /**
   * Delete a task
   */
  async delete(taskId: string): Promise<void> {
    const response = await fetch(`/api/partner/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete task");
    }
  },
};

