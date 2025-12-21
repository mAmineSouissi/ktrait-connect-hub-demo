import type {
  ChantierListResponse,
  ChantierDetailResponse,
  CreateChantierRequest,
  UpdateChantierRequest,
} from "@/types/chantier.types";

const API_BASE = "/api/admin/chantiers";

/**
 * Get list of chantiers with filters and pagination
 */
export async function getChantiers(params?: {
  search?: string;
  project_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortKey?: string;
  order?: "asc" | "desc";
}): Promise<ChantierListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append("search", params.search);
  if (params?.project_id) searchParams.append("project_id", params.project_id);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.offset) searchParams.append("offset", params.offset.toString());
  if (params?.sortKey) searchParams.append("sortKey", params.sortKey);
  if (params?.order) searchParams.append("order", params.order);

  const response = await fetch(`${API_BASE}?${searchParams.toString()}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch chantiers");
  }
  return response.json();
}

/**
 * Get a single chantier with all details
 */
export async function getChantier(id: string): Promise<ChantierDetailResponse> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch chantier");
  }
  return response.json();
}

/**
 * Create a new chantier
 */
export async function createChantier(
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
}

/**
 * Update a chantier
 */
export async function updateChantier(
  id: string,
  data: UpdateChantierRequest
): Promise<{ chantier: ChantierDetailResponse["chantier"] }> {
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
}

/**
 * Delete a chantier
 */
export async function deleteChantier(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete chantier");
  }
}

// ==================== TEAM MEMBERS ====================

export interface CreateTeamMemberRequest {
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
}

export interface UpdateTeamMemberRequest {
  name?: string;
  role?: string;
  phone?: string | null;
  email?: string | null;
}

export async function getTeamMembers(chantierId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/team`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch team members");
  }
  return response.json();
}

export async function createTeamMember(
  chantierId: string,
  data: CreateTeamMemberRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create team member");
  }
  return response.json();
}

export async function updateTeamMember(
  chantierId: string,
  teamId: string,
  data: UpdateTeamMemberRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/team/${teamId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update team member");
  }
  return response.json();
}

export async function deleteTeamMember(chantierId: string, teamId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/team/${teamId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete team member");
  }
}

// ==================== PLANNING TASKS ====================

export interface CreatePlanningTaskRequest {
  task_name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
}

export interface UpdatePlanningTaskRequest {
  task_name?: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
  order_index?: number;
}

export async function getPlanningTasks(chantierId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/planning`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch planning tasks");
  }
  return response.json();
}

export async function createPlanningTask(
  chantierId: string,
  data: CreatePlanningTaskRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/planning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create planning task");
  }
  return response.json();
}

export async function updatePlanningTask(
  chantierId: string,
  taskId: string,
  data: UpdatePlanningTaskRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/planning/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update planning task");
  }
  return response.json();
}

export async function deletePlanningTask(chantierId: string, taskId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/planning/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete planning task");
  }
}

// ==================== GALLERY ====================

export interface CreateGalleryItemRequest {
  title: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
}

export interface UpdateGalleryItemRequest {
  title?: string;
  description?: string | null;
  media_type?: "photo" | "video";
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
}

export async function getGalleryItems(chantierId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/gallery`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch gallery items");
  }
  return response.json();
}

export async function createGalleryItem(
  chantierId: string,
  data: CreateGalleryItemRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create gallery item");
  }
  return response.json();
}

export async function updateGalleryItem(
  chantierId: string,
  galleryId: string,
  data: UpdateGalleryItemRequest
) {
  const response = await fetch(
    `${API_BASE}/${chantierId}/gallery/${galleryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update gallery item");
  }
  return response.json();
}

export async function deleteGalleryItem(chantierId: string, galleryId: string) {
  const response = await fetch(
    `${API_BASE}/${chantierId}/gallery/${galleryId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete gallery item");
  }
}

// ==================== NOTES ====================

export interface CreateNoteRequest {
  author: string;
  content: string;
  date?: string;
}

export interface UpdateNoteRequest {
  author?: string;
  content?: string;
  date?: string;
}

export async function getNotes(chantierId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/notes`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch notes");
  }
  return response.json();
}

export async function createNote(chantierId: string, data: CreateNoteRequest) {
  const response = await fetch(`${API_BASE}/${chantierId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create note");
  }
  return response.json();
}

export async function updateNote(
  chantierId: string,
  noteId: string,
  data: UpdateNoteRequest
) {
  const response = await fetch(`${API_BASE}/${chantierId}/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update note");
  }
  return response.json();
}

export async function deleteNote(chantierId: string, noteId: string) {
  const response = await fetch(`${API_BASE}/${chantierId}/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete note");
  }
}
