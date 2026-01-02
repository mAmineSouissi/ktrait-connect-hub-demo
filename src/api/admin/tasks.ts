/**
 * Client-side API functions for project task management
 */

export interface ProjectTask {
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
  } | null;
}

export interface TaskListResponse {
  tasks: ProjectTask[];
}

export interface CreateTaskRequest {
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

export interface UpdateTaskRequest {
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

export interface CreateTaskResponse {
  task: ProjectTask;
}

export interface UpdateTaskResponse {
  task: ProjectTask;
}

export const tasks = {
  /**
   * List all tasks for a project
   */
  async list(projectId: string): Promise<TaskListResponse> {
    const response = await fetch(`/api/admin/projects/${projectId}/tasks`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch tasks");
    }

    return response.json();
  },

  /**
   * Create a new task
   */
  async create(
    projectId: string,
    data: CreateTaskRequest
  ): Promise<CreateTaskResponse> {
    const response = await fetch(`/api/admin/projects/${projectId}/tasks`, {
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
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<UpdateTaskResponse> {
    const response = await fetch(
      `/api/admin/projects/${projectId}/tasks/${taskId}`,
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
      throw new Error(error.error || "Failed to update task");
    }

    return response.json();
  },

  /**
   * Delete a task
   */
  async delete(projectId: string, taskId: string): Promise<void> {
    const response = await fetch(
      `/api/admin/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete task");
    }
  },
};

