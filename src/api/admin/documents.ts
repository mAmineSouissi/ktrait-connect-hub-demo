import type { Document, DocumentWithDetails } from "@/types/document.types";

const API_BASE = "/api/admin/documents";

/**
 * Client-side API functions for document management
 */

export interface DocumentListResponse {
  documents: DocumentWithDetails[];
  total: number;
}

export interface CreateDocumentRequest {
  client_id?: string;
  project_id?: string;
  partner_id?: string;
  name: string;
  file_type?: string;
  folder?: string;
  file_url?: string;
  file_size?: string;
  status?: "en_attente" | "validé" | "rejeté";
}

export interface UpdateDocumentRequest {
  name?: string;
  file_type?: string;
  folder?: string;
  file_url?: string;
  file_size?: string;
  status?: "en_attente" | "validé" | "rejeté";
  client_id?: string | null;
  project_id?: string | null;
  partner_id?: string | null;
}

export interface CreateDocumentResponse {
  document: Document;
  message?: string;
}

export interface UpdateDocumentResponse {
  document: Document;
  message?: string;
}

export interface DeleteDocumentResponse {
  message: string;
  deleted: boolean;
}

export const documents = {
  /**
   * List all documents with filters
   */
  async list(params?: {
    client_id?: string;
    project_id?: string;
    partner_id?: string;
    folder?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<DocumentListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.client_id) queryParams.append("client_id", params.client_id);
    if (params?.project_id) queryParams.append("project_id", params.project_id);
    if (params?.partner_id) queryParams.append("partner_id", params.partner_id);
    if (params?.folder) queryParams.append("folder", params.folder);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch documents");
    }

    return response.json();
  },

  /**
   * Get document details by ID
   */
  async getById(id: string): Promise<{ document: Document }> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch document");
    }

    return response.json();
  },

  /**
   * Create a new document
   */
  async create(data: CreateDocumentRequest): Promise<CreateDocumentResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create document");
    }

    return response.json();
  },

  /**
   * Update document by ID
   */
  async update(
    id: string,
    data: UpdateDocumentRequest
  ): Promise<UpdateDocumentResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update document");
    }

    return response.json();
  },

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<DeleteDocumentResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete document");
    }

    return response.json();
  },
};
