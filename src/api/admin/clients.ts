import type {
  ClientListResponse,
  ClientDetailResponse,
  CreateClientRequest,
  UpdateClientRequest,
  CreateClientResponse,
  UpdateClientResponse,
  DeleteClientResponse,
  ClientListItem,
  ClientDetail,
} from "@/types/client.types";
import { users } from "./users";
import type {
  UserListResponse,
  UserDetailResponse,
} from "@/types/user-management.types";

/**
 * Client-side API functions for client management
 * Wraps the users API with client-specific types and role filtering
 */

export const clients = {
  /**
   * List all clients
   */
  async list(params?: {
    search?: string;
    limit?: number;
    offset?: number;
    sortKey?: string;
    order?: "asc" | "desc";
  }): Promise<ClientListResponse> {
    const userResponse: UserListResponse = await users.list({
      role: "client",
      search: params?.search,
      limit: params?.limit,
      offset: params?.offset,
      sortKey: params?.sortKey,
      order: params?.order,
    });

    return {
      clients: userResponse.users as ClientListItem[],
      total: userResponse.total,
    };
  },

  /**
   * Get client details by ID
   */
  async getById(id: string): Promise<ClientDetailResponse> {
    const userResponse: UserDetailResponse = await users.getById(id);
    return {
      client: userResponse.user as ClientDetail,
    };
  },

  /**
   * Create a new client
   */
  async create(data: CreateClientRequest): Promise<CreateClientResponse> {
    const userResponse = await users.create({
      ...data,
      role: "client",
    });

    return {
      client: userResponse.user as ClientDetail,
      message: userResponse.message,
    };
  },

  /**
   * Update client by ID
   */
  async update(
    id: string,
    data: UpdateClientRequest
  ): Promise<UpdateClientResponse> {
    const userResponse = await users.update(id, data);
    return {
      client: userResponse.user as ClientDetail,
      message: userResponse.message,
    };
  },

  /**
   * Delete client by ID
   */
  async delete(
    id: string,
    soft: boolean = false
  ): Promise<DeleteClientResponse> {
    const userResponse = await users.delete(id, soft);
    return {
      message: userResponse.message,
      deleted: userResponse.deleted,
    };
  },
};
