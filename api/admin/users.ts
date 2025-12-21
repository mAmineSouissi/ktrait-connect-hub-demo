import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserDetailResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "@/types/user-management.types";

const API_BASE = "/api/admin/users";

/**
 * Client-side API functions for user management
 */

export const users = {
  async list(params?: {
    search?: string;
    role?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.is_active !== undefined)
      queryParams.append("is_active", String(params.is_active));
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
      throw new Error(error.error || "Failed to fetch users");
    }

    return response.json();
  },

  /**
   * Get user details by ID
   */
  async getById(id: string): Promise<UserDetailResponse> {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch user");
    }

    return response.json();
  },

  /**
   * Create a new user
   */
  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create user");
    }

    return response.json();
  },

  /**
   * Update user by ID
   */
  async update(
    id: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update user");
    }

    return response.json();
  },

  async delete(id: string, soft: boolean = false): Promise<DeleteUserResponse> {
    const url = `${API_BASE}/${id}${soft ? "?soft=true" : ""}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete user");
    }

    return response.json();
  },
};
