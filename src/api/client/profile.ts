/**
 * Client-side API functions for profile management
 */

export interface ClientProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  company_name?: string | null;
  tax_id?: string | null;
}

export interface GetProfileResponse {
  profile: ClientProfile;
}

export interface UpdateProfileResponse {
  profile: ClientProfile;
  message?: string;
}

const API_BASE = "/api/client/profile";

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const profile = {
  /**
   * Get current client's profile
   */
  async get(): Promise<GetProfileResponse> {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch profile");
    }

    return response.json();
  },

  /**
   * Update current client's profile
   */
  async update(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await fetch(API_BASE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    return response.json();
  },

  /**
   * Change password (verify current password and update to new password)
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await fetch(`${API_BASE}/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }

    return response.json();
  },
};

