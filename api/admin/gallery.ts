import type { ProjectGalleryItem } from "@/types/gallery.types";

const API_BASE = "/api/admin/projects";

/**
 * Client-side API functions for project gallery management
 */

export interface CreateGalleryItemRequest {
  title: string;
  description?: string;
  media_type?: "photo" | "video";
  file_url: string;
  thumbnail_url?: string;
  date?: string;
}

export interface UpdateGalleryItemRequest {
  title?: string;
  description?: string;
  media_type?: "photo" | "video";
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
}

export interface CreateGalleryItemResponse {
  galleryItem: ProjectGalleryItem;
  message?: string;
}

export interface UpdateGalleryItemResponse {
  galleryItem: ProjectGalleryItem;
  message?: string;
}

export interface DeleteGalleryItemResponse {
  message: string;
  deleted: boolean;
}

export interface GetGalleryItemResponse {
  galleryItem: ProjectGalleryItem;
}

export const gallery = {
  /**
   * List all gallery items for a project
   */
  async list(projectId: string): Promise<{ gallery: ProjectGalleryItem[] }> {
    const response = await fetch(`${API_BASE}/${projectId}/gallery`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch gallery");
    }

    return response.json();
  },

  /**
   * Get a single gallery item by ID
   */
  async getById(
    projectId: string,
    galleryId: string
  ): Promise<GetGalleryItemResponse> {
    const response = await fetch(
      `${API_BASE}/${projectId}/gallery/${galleryId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch gallery item");
    }

    return response.json();
  },

  /**
   * Create a new gallery item for a project
   */
  async create(
    projectId: string,
    data: CreateGalleryItemRequest
  ): Promise<CreateGalleryItemResponse> {
    const response = await fetch(`${API_BASE}/${projectId}/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create gallery item");
    }

    return response.json();
  },

  /**
   * Update gallery item by ID
   */
  async update(
    projectId: string,
    galleryId: string,
    data: UpdateGalleryItemRequest
  ): Promise<UpdateGalleryItemResponse> {
    const response = await fetch(
      `${API_BASE}/${projectId}/gallery/${galleryId}`,
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
      throw new Error(error.error || "Failed to update gallery item");
    }

    return response.json();
  },

  /**
   * Delete gallery item by ID
   */
  async delete(
    projectId: string,
    galleryId: string
  ): Promise<DeleteGalleryItemResponse> {
    const response = await fetch(
      `${API_BASE}/${projectId}/gallery/${galleryId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete gallery item");
    }

    return response.json();
  },
};
