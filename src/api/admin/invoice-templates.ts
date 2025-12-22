import type {
  TemplateListResponse,
  TemplateDetailResponse,
  CreateTemplateRequest,
  CreateTemplateResponse,
  UpdateTemplateRequest,
  UpdateTemplateResponse,
  DeleteTemplateResponse,
} from "@/types/invoice-template.types";

const API_BASE = "/api/admin/invoice-templates";

/**
 * Client-side API functions for invoice template management
 */
export const invoiceTemplates = {
  /**
   * List templates with filters
   */
  async list(params?: {
    type?: "devis" | "facture";
    is_active?: boolean;
    is_default?: boolean;
  }): Promise<TemplateListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.is_active !== undefined)
      queryParams.append("is_active", String(params.is_active));
    if (params?.is_default !== undefined)
      queryParams.append("is_default", String(params.is_default));

    const url = `${API_BASE}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch templates");
    }

    return response.json();
  },

  /**
   * Get template details by ID
   */
  async getById(id: string): Promise<TemplateDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch template");
    }

    return response.json();
  },

  /**
   * Create a new template
   */
  async create(data: CreateTemplateRequest): Promise<CreateTemplateResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.description) formData.append("description", data.description);
    formData.append("template_file", data.template_file);
    formData.append("template_file_type", data.template_file_type);
    if (data.is_default !== undefined)
      formData.append("is_default", String(data.is_default));
    if (data.is_active !== undefined)
      formData.append("is_active", String(data.is_active));

    const response = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create template");
    }

    return response.json();
  },

  /**
   * Update a template
   */
  async update({
    id,
    data,
  }: {
    id: string;
    data: UpdateTemplateRequest;
  }): Promise<UpdateTemplateResponse> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description || "");
    if (data.template_file)
      formData.append("template_file", data.template_file);
    if (data.is_default !== undefined)
      formData.append("is_default", String(data.is_default));
    if (data.is_active !== undefined)
      formData.append("is_active", String(data.is_active));

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update template");
    }

    return response.json();
  },

  /**
   * Delete a template
   */
  async delete(id: string): Promise<DeleteTemplateResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete template");
    }

    return response.json();
  },
};
