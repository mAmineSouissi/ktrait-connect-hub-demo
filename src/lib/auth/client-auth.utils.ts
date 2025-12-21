import { api } from "@/api";
import { User } from "@/types/user.types";

/**
 * Get the current authenticated user (client-side)
 * This is a utility function for components that need to check user permissions
 */
export async function getClientUser(): Promise<User | null> {
  try {
    const user = await api.auth.getCurrentUser();
    return user;
  } catch (error) {
    console.error("Error getting client user:", error);
    return null;
  }
}
